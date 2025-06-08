import { Payload } from "@/models/common/Payload";
import {
	FieldUpdateOneRes,
	GetGameStateReq,
	GetGameStateRes,
	JoinGameReq,
	PlayerInfoChanged,
	RoundFinishedRes,
	RoundStartReq,
	RoundStartRes,
	TurnChangedRes,
} from "@/models/game/Game";
import {
	GetPlayerInfoReq,
	GetPlayerInfoRes,
	PlayerData,
	PlayerState,
} from "@/models/game/Player";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useSessionToken } from "@/stores/common/SessionStore";
import { useSocketActions } from "@/stores/common/SocketStore";
import { useGameActions, useGameMyInfo } from "@/stores/game/GameStore";
import update from "immutability-helper";
import { toast } from "sonner";

const TIMEOUT = 5000;
const CHANNEL: "game" = "game";

const useGame = () => {
	const token = useSessionToken();
	const actions = useSocketActions();
	const gameId = useRoomInfoStore((state) => state.room?.roomId);
	const { setGameData, setMyInfo, pushRoundReview } = useGameActions();
	const myId = useGameMyInfo()?.playerId;

	const register = actions.registerHandler;
	const unregister = actions.unregisterHandler;

	function sendAndWaitForResponse<
		TSend extends object,
		TRes extends { type: string },
	>(
		channel: "room" | "game",
		sendPayload: TSend,
		responseType: TRes["type"],
		handler: (res: TRes) => boolean,
		timeoutMs = TIMEOUT,
	): Promise<TRes> {
		return new Promise<TRes>((resolve, reject) => {
			let timer: NodeJS.Timeout | null = null;

			const callback = (msg: TRes) => {
				if (handler(msg)) {
					unregister(channel, responseType, callback);
					if (timer) clearTimeout(timer);
					resolve(msg);
				}
			};

			register(channel, responseType, callback);
			actions.send(channel, sendPayload);

			timer = setTimeout(() => {
				unregister(channel, responseType, callback);
				reject(new Error("TIMEOUT"));
			}, timeoutMs);
		});
	}

	const open = () => {
		if (!actions.isConnected(CHANNEL) && token) {
			actions.open(CHANNEL, token);
		}
	};

	const join = (gameId: number) => {
		actions.send(CHANNEL, {
			type: "join-game",
			payload: { gameId },
		} as JoinGameReq);
	};

	const fieldUpdateOne = (msg: FieldUpdateOneRes) => {
		setGameData((prev) => {
			if (!prev) return prev;
			const newField: [number, number][][] = prev.field.map((rowArr, r) =>
				r === msg.payload.row
					? rowArr.map((cell, c) =>
							c === msg.payload.column
								? [msg.payload.cardId, msg.payload.isFlipped ?? 0]
								: cell,
						)
					: rowArr,
			);
			return { ...prev, field: newField };
		});
	};

	const roundStartedCallback = (msg: RoundStartRes) => {
		setGameData(() => msg.payload);
	};
	const myInfoUpdate = (msg: GetPlayerInfoRes) => setMyInfo(msg.payload);

	const playerInfoUpdate = (msg: PlayerInfoChanged) => {
		setGameData((prev) => {
			if (!prev) return prev;
			const targetIdx = prev.players.findIndex(
				(player) => player.playerId === msg.payload.playerId,
			);
			if (targetIdx >= 0) {
				return update(prev, {
					players: { [targetIdx]: { $set: msg.payload } },
				});
			}
			return prev;
		});
	};

	const turnUpdate = (msg: TurnChangedRes) => {
		setGameData((prev) => {
			if (!prev) return prev;
			return update(prev, {
				currentTurnPlayerId: { $set: msg.payload.nextTurnPlayerId },
			});
		});
	};

	const checkRoundFinished = (msg: RoundFinishedRes) => {
		pushRoundReview(msg.payload);
		forceUpdate();
	};

	const registerHandlers = () => {
		register<RoundStartRes>(CHANNEL, "Round-Started", roundStartedCallback);
		register<FieldUpdateOneRes>(CHANNEL, "Field-Changed", fieldUpdateOne);
		register<TurnChangedRes>(CHANNEL, "Turn-Changed", turnUpdate);
		register<GetPlayerInfoRes>(CHANNEL, "Player-Info", myInfoUpdate);
		register<PlayerInfoChanged>(
			CHANNEL,
			"Player-Info-Changed",
			playerInfoUpdate,
		);
		register<PlayerInfoChanged>(
			CHANNEL,
			"Changed-Public-Player-Info",
			playerInfoUpdate,
		);
		register<RoundFinishedRes>(CHANNEL, "Round-Finished", checkRoundFinished);
	};

	const unregisterHandlers = () => {
		unregister(CHANNEL, "Round-Started", roundStartedCallback);
		unregister(CHANNEL, "Field-Changed", fieldUpdateOne);
		unregister(CHANNEL, "Turn-Changed", turnUpdate);
		unregister(CHANNEL, "Player-Info", myInfoUpdate);
		unregister(CHANNEL, "Player-Info-Changed", playerInfoUpdate);
		unregister(CHANNEL, "Changed-Public-Player-Info", playerInfoUpdate);
		unregister(CHANNEL, "Round-Finished", checkRoundFinished);
	};

	const init = () => {
		registerHandlers();
	};

	const deinit = () => {
		unregisterHandlers();
		setGameData(null);
	};

	const forceUpdate = async () => {
		if (!gameId) return;
		try {
			const result = await sendAndWaitForResponse<
				GetGameStateReq,
				GetGameStateRes
			>(
				CHANNEL,
				{ type: "get-game-state", payload: { gameId } },
				"Game-State",
				() => true,
			);
			setGameData(result.payload);

			actions.send(CHANNEL, {
				type: "get-player-info",
				payload: { gameId },
			} as GetPlayerInfoReq);

			return result.payload;
		} catch (e) {
			console.error(e);
		}
	};

	const checkMyTurn = async () => {
		const game = await forceUpdate();
		if (!game || !myId) return false;
		if (myId !== game.currentTurnPlayerId) {
			toast("Not your turn");
			return false;
		}
		return true;
	};

	const dropMyCard = async (cardId: number) => {
		if (!gameId) return;
		if (!(await checkMyTurn())) return;
		try {
			type Req = Payload<"drop-card", { gameId: number; cardId: number }>;
			actions.send(CHANNEL, {
				type: "drop-card",
				payload: { gameId, cardId },
			} as Req);
		} catch (e) {
			console.error(e);
		}
	};

	const usePathCard = async (
		cardId: number,
		row: number,
		column: number,
		isFlipped: number,
	) => {
		if (!gameId) return;
		if (!(await checkMyTurn())) return;
		try {
			type Req = Payload<
				"use-path-card",
				{
					gameId: number;
					cardId: number;
					row: number;
					column: number;
					isFlipped: number;
				}
			>;

			await new Promise<void>((resolve, reject) => {
				let timer: NodeJS.Timeout | null = null;
				const callback = (msg: Payload<string, unknown>) => {
					unregister(CHANNEL, "Place-PathCard-Failed", callback);
					unregister(CHANNEL, "Player-Info", callback);
					if (timer) clearTimeout(timer);

					if (msg.type === "Place-PathCard-Failed") reject("FAILED");
					if (msg.type === "Player-Info") setMyInfo(msg.payload as PlayerData);

					resolve();
				};

				register(CHANNEL, "Place-PathCard-Failed", callback);
				register(CHANNEL, "Player-Info", callback);

				actions.send(CHANNEL, {
					type: "use-path-card",
					payload: { gameId, cardId, row, column, isFlipped },
				} as Req);

				timer = setTimeout(() => {
					unregister(CHANNEL, "Place-PathCard-Failed", callback);
					unregister(CHANNEL, "Player-Info", callback);
					reject(new Error("TIMEOUT"));
				}, TIMEOUT);
			});
		} catch (e) {
			toast("카드를 놓을 수 없습니다.");
			console.error(e);
		}
	};

	const useRockfallCard = async (
		cardId: number,
		row: number,
		column: number,
	) => {
		if (!gameId) return;
		if (!(await checkMyTurn())) return;
		try {
			type Req = Payload<
				"use-rockfall-card",
				{ gameId: number; cardId: number; row: number; column: number }
			>;
			type Res = Payload<
				"Unicast: Rockfall-Card-Use",
				{ field: [number, number][][] }
			>;
			const result = await sendAndWaitForResponse<Req, Res>(
				CHANNEL,
				{ type: "use-rockfall-card", payload: { gameId, cardId, row, column } },
				"Unicast: Rockfall-Card-Use",
				() => true,
			);
			setGameData((prev) =>
				update(prev, { field: { $set: result.payload.field } }),
			);
		} catch (e) {
			console.error(e);
		}
	};

	const useMapCard = async (cardId: number, row: 1 | 3 | 5, column: 8) => {
		if (!gameId) return -1;
		if (!(await checkMyTurn())) return -1;

		try {
			type Req = Payload<
				"use-map-card",
				{ gameId: number; cardId: number; row: number; column: number }
			>;
			type Res = Payload<
				"Unicast: Map-Card-Use",
				{ playerhand: []; destCardID: number }
			>;
			const result = await sendAndWaitForResponse<Req, Res>(
				CHANNEL,
				{ type: "use-map-card", payload: { gameId, cardId, row, column } },
				"Unicast: Map-Card-Use",
				() => true,
			);
			setMyInfo((prev) =>
				update(prev, { hand: { $set: result.payload.playerhand } }),
			);
			return result.payload.destCardID;
		} catch (e) {
			console.error(e);
		}
		return -1;
	};

	const useRepairCard = async (
		cardId: number,
		targetPlayerId: number,
		targetState: PlayerState,
	) => {
		if (!gameId) return;
		if (!(await checkMyTurn())) return;
		try {
			type Req = Payload<
				"use-repair-card",
				{
					gameId: number;
					cardId: number;
					targetPlayerId: number;
					targetState: PlayerState;
				}
			>;
			type Res = Payload<"Unicast: Repair-Card-Use", { playerHand: number[] }>;
			const result = await sendAndWaitForResponse<Req, Res>(
				CHANNEL,
				{
					type: "use-repair-card",
					payload: { gameId, cardId, targetPlayerId, targetState },
				},
				"Unicast: Repair-Card-Use",
				() => true,
			);
			setMyInfo((prev) =>
				update(prev, { hand: { $set: result.payload.playerHand } }),
			);
		} catch (e) {
			console.error(e);
		}
	};

	const useBrokenCard = async (cardId: number, targetPlayerId: number) => {
		if (!gameId) return;
		if (!(await checkMyTurn())) return;
		try {
			type Req = Payload<
				"use-broken-card",
				{ gameId: number; cardId: number; targetPlayerId: number }
			>;
			actions.send(CHANNEL, {
				type: "use-broken-card",
				payload: { gameId, cardId, targetPlayerId },
			} as Req);
		} catch (e) {
			console.error(e);
		}
	};

	const startRound = async () => {
		try {
			actions.send(CHANNEL, {
				type: "start-round",
				payload: { gameId },
			} as RoundStartReq);
		} catch (e) {
			console.log(e);
		}
	};

	return {
		open,
		init,
		deinit,
		join,
		forceUpdate,
		dropMyCard,
		usePathCard,
		useRockfallCard,
		useMapCard,
		useRepairCard,
		useBrokenCard,
		startRound,
	};
};

export default useGame;

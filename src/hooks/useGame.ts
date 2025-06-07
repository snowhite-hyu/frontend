import { Payload } from "@/models/common/Payload";
import {
	GetGameStateReq,
	GetGameStateRes,
	JoinGameReq,
	JoinGameRes,
	OpenPlayerState,
	RoundFinishedRes,
	RoundStartRes,
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
import { useGameActions, useGameData, useGameMyInfo } from "@/stores/game/GameStore";
import update from "immutability-helper";
import { toast } from "sonner";

const TIMEOUT = 5000;

const useGame = () => {
	const token = useSessionToken();
	const actions = useSocketActions();
	const gameId = useRoomInfoStore((state) => state.room?.roomId);
	const { setGameData, setMyInfo, setRoundReview } = useGameActions();
	const gameData = useGameData();
	const myInfo = useGameMyInfo();

	function sendAndWaitForResponse<TSend extends object, TRes>(
		channel: "room" | "game",
		sendPayload: TSend,
		responseType: string,
		handler: (res: TRes) => boolean,
		timeoutMs = TIMEOUT,
	): Promise<TRes> {
		return new Promise<TRes>((resolve, reject) => {
			let timer: NodeJS.Timeout | null = null;

			const callback = (msg: TRes) => {
				if (handler(msg)) {
					actions.unregisterHandler(channel, responseType, callback);
					if (timer) clearTimeout(timer);
					resolve(msg);
				}
			};

			actions.registerHandler(channel, responseType, callback);
			actions.send(channel, sendPayload);

			timer = setTimeout(() => {
				actions.unregisterHandler(channel, responseType, callback);
				reject(new Error("TIMEOUT"));
			}, timeoutMs);
		});
	}

	const open = () => {
		if (!actions.isConnected("game") && token) {
			actions.open("game", token);
		}
	};

	const join = async (gameId: number) => {
		await sendAndWaitForResponse<JoinGameReq, JoinGameRes>(
			"game",
			{ type: "join-game", payload: { gameId } },
			"Game-Joined",
			() => true,
		);
	}

	const roundStartedCallback = (msg: RoundStartRes) => {
		setGameData(msg.payload.game);
	};

	type FieldUpdateRes = Payload<string, { field: [number, number][][] }>;
	const fieldUpdate = (msg: FieldUpdateRes) => {
		setGameData(update(gameData, { field: { $set: msg.payload.field } }));
	};
	type FieldUpdateOneRes = Payload<
		string,
		{ cardId: number; row: number; column: number; isFilpped?: number }
	>;
	const fieldUpdateOne = (msg: FieldUpdateOneRes) => {
		setGameData(update(gameData, {
			field: {
				[msg.payload.row]: {
					[msg.payload.column]: {
						$set: [msg.payload.cardId, msg.payload.isFilpped ?? 0],
					},
				},
			}
		}));
	};
	type PlayerUpdateOneRes = Payload<
		string,
		{ targetPlayerId: number; cardId: number; targetPlayerState: PlayerState[] }
	>;
	const playerUpdateOne = (msg: PlayerUpdateOneRes) => {
		const targetIdx = gameData?.players.findIndex(
			(player) => player.playerId === msg.payload.targetPlayerId,
		);
		if (targetIdx !== undefined) {
			setGameData(update(gameData, {
				players: {
					[targetIdx]: {
						state: {
							$set: msg.payload.targetPlayerState,
						},

					},
				},
			}));
		}
	};
	type PlayerInfoChanged = Payload<string, OpenPlayerState>;
	const playerInfoUpdate = (msg: PlayerInfoChanged) => {
		const targetIdx = gameData?.players.findIndex(
			(player) => player.playerId === msg.payload.playerId,
		);
		if (targetIdx !== undefined) {
			setGameData(update(gameData, {
				players: { [targetIdx]: { $set: msg.payload } },
			}));
		};
		type TurnChangedRes = Payload<"Turn-Changed", { nextTurnPlayerId: number }>;
		const turnUpdate = (msg: TurnChangedRes) => {
			if (gameData?.currentTurnPlayerId === myInfo?.playerId) {
				drawNewCard();
			}
			setGameData(update(gameData, {
				currentTurnPlayerId: { $set: msg.payload.nextTurnPlayerId },
			}));
		};
		const checkRoundFinished = (msg: RoundFinishedRes) => {
			setRoundReview(msg.payload);
		}

		const init = async () => {
			if (gameId) {
				actions.registerHandler<RoundStartRes>(
					"game",
					"Round-Started",
					roundStartedCallback,
				);
				actions.registerHandler<FieldUpdateRes>(
					"game",
					"Broadcast: Rockfall-Card-use",
					fieldUpdate,
				);
				actions.registerHandler<FieldUpdateOneRes>(
					"game",
					"Broadcast: Map-Card-use",
					fieldUpdateOne,
				);
				actions.registerHandler<PlayerUpdateOneRes>(
					"game",
					"Broadcast: Broken-Card-use",
					playerUpdateOne,
				);
				actions.registerHandler<PlayerUpdateOneRes>(
					"game",
					"Broadcast: Repair-Card-use",
					playerUpdateOne,
				);
				actions.registerHandler<FieldUpdateOneRes>(
					"game",
					"Field-Changed",
					fieldUpdateOne,
				);
				actions.registerHandler<TurnChangedRes>(
					"game",
					"Turn-Changed",
					turnUpdate,
				);
				actions.registerHandler<PlayerInfoChanged>(
					"game",
					"Player-Info-Changed",
					playerInfoUpdate,
				);
				actions.registerHandler<PlayerInfoChanged>(
					"game",
					"Changed-Public-Player-Info",
					playerInfoUpdate,
				);
				actions.registerHandler<RoundFinishedRes>(
					"game",
					"Round-Finished",
					checkRoundFinished,
				);
				forceUpdate();
			}
		};

		const deinit = () => {
			actions.unregisterHandler("game", "Round-Started", roundStartedCallback);
			actions.unregisterHandler(
				"game",
				"Broadcast: Rockfall-Card-use",
				fieldUpdate,
			);
			actions.unregisterHandler(
				"game",
				"Broadcast: Map-Card-use",
				fieldUpdateOne,
			);
			actions.unregisterHandler(
				"game",
				"Broadcast: Broken-Card-use",
				playerUpdateOne,
			);
			actions.unregisterHandler(
				"game",
				"Broadcast: Repair-Card-use",
				playerUpdateOne,
			);
			actions.unregisterHandler("game", "Field-Changed", fieldUpdateOne);
			actions.unregisterHandler("game", "Turn-Changed", turnUpdate);
			actions.unregisterHandler("game", "Player-Info-Changed", playerInfoUpdate);
			actions.unregisterHandler("game", "Changed-Public-Player-Info", playerInfoUpdate);
			actions.unregisterHandler("game", "Round-Finished", checkRoundFinished);
			setGameData(null);
		};

		const forceUpdate = async () => {
			if (gameId) {
				try {
					const result = await sendAndWaitForResponse<
						GetGameStateReq,
						GetGameStateRes
					>(
						"game",
						{
							type: "get-game-state",
							payload: {
								gameId,
							},
						},
						"Game-State",
						() => true,
					);
					setGameData(result.payload);

					const myInfoResult = await sendAndWaitForResponse<
						GetPlayerInfoReq,
						GetPlayerInfoRes
					>(
						"game",
						{
							type: "get-player-info",
							payload: {
								gameId,
							},
						},
						"Player-Info",
						() => true,
					);
					setMyInfo(myInfoResult.payload);
					return result.payload;
				} catch (e) {
					console.log(e);
				}
			}
		};

		const checkMyTurn = async () => {
			const game = await forceUpdate();
			if (!game || !myInfo) return false;

			if (myInfo.playerId !== game.currentTurnPlayerId) {
				toast("Not your turn");
				return false;
			}

			return true;
		};

		const getMyCards = () => { };

		const drawNewCard = async () => {
			if (!gameId) return;

			try {
				type req = Payload<"get-card", { gameId: number }>;
				type res = Payload<"Got-Card", PlayerData>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "get-card",
						payload: {
							gameId,
						},
					},
					"Got-Card",
					() => true,
				);
				setMyInfo(result.payload);
			} catch (e) {
				console.log(e);
			}
		};

		const dropMyCard = async (cardId: number) => {
			if (!gameId) return;
			if (!checkMyTurn()) return;

			try {
				type req = Payload<"drop-card", { gameId: number; cardId: number }>;
				type res = Payload<"Card-Dropped", { hand: number[] }>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "drop-card",
						payload: {
							gameId,
							cardId,
						},
					},
					"Card-Dropped",
					() => true,
				);
				setMyInfo(update(myInfo, { hand: { $set: result.payload.hand } }));
			} catch (e) {
				console.log(e);
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
				type req = Payload<
					"use-path-card",
					{
						gameId: number;
						cardId: number;
						row: number;
						column: number;
						isFlipped: number;
					}
				>;

				const promise = new Promise<void>((resolve, reject) => {
					let timer: NodeJS.Timeout | null = null;

					const callback = (msg: Payload<string, unknown>) => {
						actions.unregisterHandler("game", "Place-PathCard-Failed", callback);
						actions.unregisterHandler("game", "Player-Info", callback);
						if (timer) clearTimeout(timer);

						if (msg.type === "Place-PathCard-Failed") {
							reject("FAILED");
						}
						if (msg.type === "Player-Info") {
							setMyInfo(msg.payload as PlayerData);
						}
						resolve();
					};

					actions.registerHandler("game", "Place-PathCard-Failed", callback);
					actions.registerHandler("game", "Player-Info", callback);
					actions.send("game", {
						type: "use-path-card",
						payload: {
							gameId,
							cardId,
							row,
							column,
							isFlipped,
						},
					} as req);

					timer = setTimeout(() => {
						actions.unregisterHandler("game", "Place-PathCard-Failed", callback);
						actions.unregisterHandler("game", "Player-Info", callback);
						reject(new Error("TIMEOUT"));
					}, TIMEOUT);
				});

				await promise;
			} catch (e) {
				toast(`카드를 놓을 수 없습니다.`);
				console.log(e);
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
				type req = Payload<
					"use-rockfall-card",
					{ gameId: number; cardId: number; row: number; column: number }
				>;
				type res = Payload<
					"Unicast: Rockfall-Card-Use",
					{ field: [number, number][][] }
				>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "use-rockfall-card",
						payload: {
							gameId,
							cardId,
							row,
							column,
						},
					},
					"Unicast: Rockfall-Card-Use",
					() => true,
				);
				setGameData(update(gameData, { field: { $set: result.payload.field } }));
			} catch (e) {
				console.log(e);
			}
		};

		const useMapCard = async (cardId: number, row: 1 | 3 | 5, column: 8) => {
			if (!gameId) return;
			if (!(await checkMyTurn())) return;

			try {
				type req = Payload<
					"use-map-card",
					{ gameId: number; cardId: number; row: number; column: number }
				>;
				type res = Payload<
					"Unicast: Map-Card-Use",
					{ playerhand: []; destCardID: number }
				>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "use-map-card",
						payload: {
							gameId,
							cardId,
							row,
							column,
						},
					},
					"Unicast: Map-Card-Use",
					() => true,
				);
				setMyInfo(update(myInfo, { hand: { $set: result.payload.playerhand } }));
				return result.payload.destCardID;
			} catch (e) {
				console.log(e);
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
				type req = Payload<
					"use-repair-card",
					{
						gameId: number;
						cardId: number;
						targetPlayerId: number;
						targetState: PlayerState;
					}
				>;
				type res = Payload<"Unicast: Repair-Card-Use", { playerHand: number[] }>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "use-repair-card",
						payload: {
							gameId,
							cardId,
							targetPlayerId,
							targetState,
						},
					},
					"Unicast: Repair-Card-Use",
					() => true,
				);
				setMyInfo(update(myInfo, { hand: { $set: result.payload.playerHand } }));
			} catch (e) {
				console.log(e);
			}
		};

		const useBrokenCard = async (cardId: number, targetPlayerId: number) => {
			if (!gameId) return;
			if (!(await checkMyTurn())) return;

			try {
				type req = Payload<
					"use-broken-card",
					{ gameId: number; cardId: number; targetPlayerId: number }
				>;
				type res = Payload<"Unicast: Broken-Card-Use", { playerhand: [] }>;
				const result = await sendAndWaitForResponse<req, res>(
					"game",
					{
						type: "use-broken-card",
						payload: {
							gameId,
							cardId,
							targetPlayerId,
						},
					},
					"Unicast: Broken-Card-Use",
					() => true,
				);
				setMyInfo(update(myInfo, { hand: { $set: result.payload.playerhand } }));
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
			getMyCards,
			dropMyCard,
			usePathCard,
			useRockfallCard,
			useMapCard,
			useRepairCard,
			useBrokenCard,
		};
	};
};

export default useGame;

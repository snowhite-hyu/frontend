import { List } from "@/apis/common/Room";
import type { ListResponse } from "@/models/common/Room";
import {
	JoinGameReq,
	JoinGameRes,
	RoundStartReq,
	RoundStartRes,
} from "@/models/game/Game";
import {
	CreateRoomReq,
	CreateRoomRes,
	JoinRoomReq,
	JoinRoomRes,
	QuitRoomReq,
	QuitRoomRes,
	RoomUsersRes,
	StartGameReq,
	StartGameRes,
} from "@/models/room/Room";
import { useSessionToken } from "@/stores/common/SessionStore";
import { useSocketActions } from "@/stores/common/SocketStore";
import { useRoomActions, useRoomState } from "@/stores/room/RoomStore";
import { toast } from "sonner";
import update from "immutability-helper";
import { useNavigate } from "react-router-dom";
import { useGameActions } from "@/stores/game/GameStore";

const useRoom = () => {
	const token = useSessionToken();
	const actions = useSocketActions();
	const { isMaster, gameId } = useRoomState();
	const roomActions = useRoomActions();
	const navigate = useNavigate();
	const { applyServerState } = useGameActions();

	function sendAndWaitForResponse<TSend extends object, TRes>(
		channel: "room" | "game",
		sendPayload: TSend,
		responseType: string,
		handler: (res: TRes) => boolean, // should return true to resolve, false to continue listening
		timeoutMs = 5000,
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

	const updateUsers = (msg: RoomUsersRes) => {
		roomActions.setRoom((prev) =>
			update(prev, {
				users: {
					$set: msg.payload,
				},
			}),
		);
	};

	const checkGameId = (msg: StartGameRes) => {
		roomActions.setGameId(msg.payload.gameId);
	};

	const checkGameStart = (msg: RoundStartRes) => {
		navigate("/game");
		applyServerState(msg.payload.game);
		actions.unregisterHandler("game", "Round-Started", checkGameStart);
	};

	const open = () => {
		if (token) {
			actions.open("room", token);
			actions.open("game", token);
		}
	};

	const create = async (
		roomName: string,
		maxPlayers: number,
		turnTimeLimit: number,
	) => {
		if (!actions.isConnected("room")) return;

		try {
			const result = await sendAndWaitForResponse<CreateRoomReq, CreateRoomRes>(
				"room",
				{
					type: "create",
					payload: {
						roomName,
						capacity: maxPlayers,
						turnTime: turnTimeLimit,
					},
				},
				"created-room",
				() => true,
			);
			roomActions.setRoom(() => result.payload);
			roomActions.setIsMaster(true);
			actions.registerHandler<RoomUsersRes>("room", "room-users", updateUsers);
			actions.registerHandler<StartGameRes>(
				"room",
				"Game-Started",
				checkGameId,
			);
			actions.registerHandler<RoundStartRes>(
				"game",
				"Round-Started",
				checkGameStart,
			);
			navigate("/waiting");
		} catch (e) {
			console.log(e);
			actions.unregisterHandler("room", "room-users", updateUsers);
			actions.unregisterHandler("room", "Game-Started", checkGameId);
			actions.unregisterHandler("game", "Round-Started", checkGameStart);
		}
	};

	const join = async (roomId: number) => {
		if (!actions.isConnected("room")) return;

		try {
			const result = await sendAndWaitForResponse<JoinRoomReq, JoinRoomRes>(
				"room",
				{
					type: "join",
					payload: {
						roomId,
					},
				},
				"joined-room",
				() => true,
			);
			roomActions.setRoom(() => result.payload);
			roomActions.setIsMaster(false);
			actions.registerHandler<RoomUsersRes>("room", "room-users", updateUsers);
			actions.registerHandler<StartGameRes>(
				"room",
				"Game-Started",
				checkGameId,
			);
			actions.registerHandler<RoundStartRes>(
				"game",
				"Round-Started",
				checkGameStart,
			);
			navigate("/waiting");
		} catch (e) {
			console.log(e);
			actions.unregisterHandler("room", "room-users", updateUsers);
			actions.unregisterHandler("room", "Game-Started", checkGameId);
			actions.unregisterHandler("game", "Round-Started", checkGameStart);
		}
	};

	const quit = async (roomId: number) => {
		if (!actions.isConnected("room")) return;

		try {
			await sendAndWaitForResponse<QuitRoomReq, QuitRoomRes>(
				"room",
				{
					type: "quit",
					payload: {
						roomId,
					},
				},
				"quit-success",
				() => true,
			);
			actions.close("room");
			navigate("/room");
		} catch (e) {
			console.log(e);
		}
	};

	const startGame = async (roomId: number) => {
		if (!actions.isConnected("room")) return;
		if (!actions.isConnected("game")) return;

		try {
			if (isMaster) {
				await sendAndWaitForResponse<StartGameReq, StartGameRes>(
					"room",
					{
						type: "start-game",
						payload: {
							roomId,
						},
					},
					"Game-Started",
					() => true,
				);
			}

			if (gameId) {
				await sendAndWaitForResponse<JoinGameReq, JoinGameRes>(
					"game",
					{
						type: "join-game",
						payload: {
							gameId,
						},
					},
					"Game-Joined",
					() => true,
				);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const list: () => Promise<ListResponse | false> = async () => {
		const response = await List({
			method: "get",
			url: "/rooms",
		});

		if (response.isSuccess) {
			return response.result; // RoomItem[]
		}
		toast(`${response.message}`);

		return false;
	};

	return {
		open,
		list,
		join,
		quit,
		startGame,
		create,
	};
};

export default useRoom;

import type { Payload } from "../common/Payload";

export type CreateRoomReq = Payload<
	"create",
	{
		roomName: string;
		capacity: number;
		turnTime: number;
	}
>;

export interface RoomPlayer {
	id: number;
	username: string;
	loggedIn: boolean;
}

export interface RoomData {
	roomName: string;
	roomId: number;
	masterPlayer: RoomPlayer;
	users: RoomPlayer[];
	capacity: number;
	turnTime: number;
	playing: boolean;
}

export type CreateRoomRes = Payload<"created-room", RoomData>;

export type JoinRoomReq = Payload<
	"join",
	{
		roomId: number;
	}
>;
export type JoinRoomRes = Payload<"joined-room", RoomData>;

export type RoomUsersRes = Payload<
	"room-users",
	{ id: number; username: string; loggedIn: boolean }[]
>;

export type QuitRoomReq = Payload<
	"quit",
	{
		roomId: number;
	}
>;

export type QuitRoomRes = Payload<"quit-success", {}>;

export type StartGameReq = Payload<
	"start-game",
	{
		roomId: number;
	}
>;

export type StartGameRes = Payload<
	"game-started",
	{
		gameId: number;
	}
>;

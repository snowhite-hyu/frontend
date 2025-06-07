import type { RoomUserModel } from "./User";

export interface CreateRoomRequest {
	roomName: string;
	maxPlayers: number;
	turnTimeLimit: number;
}

export interface CreateRoomResponse {
	roomId?: string;
	roomName?: string;
	currentPlayers?: number;
	maxPlayers?: number;
	turnTimeLimit?: number;
}

export interface RoomItem {
	roomId: number;
	roomName: string;
	masterPlayer: WsRoomUserModel;
	users: WsRoomUserModel[];
	capacity: number;
	turnTime: number;
	playing: boolean;
}

export type ListResponse = {
	roomList: RoomItem[];
}

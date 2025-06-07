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
	roomName: string;
	roomId: number;
	masterPlayer: RoomUserModel;
	users: RoomUserModel[];
	capacity: number;
	turnTime: number;
	isPlaying: boolean;
}

export type ListResponse = {
	roomList: RoomItem[];
};

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

// 각 속성 타입 확인 필요
export interface RoomItem {
	roomId: number;
	masterPlayer: RoomUserModel;
	users: RoomUserModel[];
	capacity: number;
	turnTime: number;
	isPlaying: boolean;
}

export type ListResponse = RoomItem[];

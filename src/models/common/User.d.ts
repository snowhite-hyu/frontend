export interface UserModel {
	id: string;
	username: string;
}

export interface RoomUserModel {
	id: number;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface WsRoomUserModel {
	id: number;
	username: string;
	loggedIn: boolean;
}
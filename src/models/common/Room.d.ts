
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

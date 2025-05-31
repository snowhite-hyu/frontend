import { BaseSocket } from "@/sockets/BaseSocket";

export class RoomSocket extends BaseSocket {

    constructor(jwtToken: string) {
        super("/room", { token: jwtToken });
    }

    public createRoom(data: { capacity: number, turnTime: number; }) {
        this.emit("create", data);
    }

    public joinRoom(data: { roomId: number; }) {
        this.emit("join", data);
    }

    public onJoinedRoom(callback: (payload: any) => void) {
        this.socket.on("joined-room", callback);
    } 

    public onRoomusers(callback: (payload: any) => void) {
        this.socket.on("room-users", callback);
    }

    public offRoomusers(callback: (payload: any) => void) {
        this.socket.off("room-users", callback);
    }

    public quitRoom(data: { roomId: number; }) {
        this.emit("quit", data);
    }

    public onCreateRoom(callback: (payload: any) => void) {
        this.socket.on("created-room", callback);
    }

}
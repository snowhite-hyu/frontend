import { BaseSocket } from "@/sockets/BaseSocket";

export class RoomSocket extends BaseSocket {

    constructor(jwtToken: string) {
        super("/room", { token: jwtToken });
    }

    public createRoom(data: { capacity: string, turnTime: string; }) {
        this.emit("create", data);
    }

    public joinRoom(data: { roomId: string; }) {
        this.emit("join", data);
    }

    public quitRoom(data: { roomId: string; }) {
        this.emit("quit", data);
    }

}
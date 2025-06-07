import { BaseSocket } from "@/sockets/BaseSocket";

type RoomEvent =
	| { type: "joined-room"; payload: any }
	| { type: "room-users"; payload: any }
	| { type: "created-room"; payload: any }
	| { type: string; payload: any };

export class RoomSocket extends BaseSocket {
	private listeners: Record<string, ((payload: any) => void)[]> = {};

	constructor(jwtToken: string) {
		super("/room", { token: jwtToken });
	}

	protected onMessage(data: string): void {
		try {
			console.debug("[RoomSocket] 수신된 원시 메시지:", data);
			const message: RoomEvent = JSON.parse(data);
			const { type, payload } = message;

			if (this.listeners[type]) {
				this.listeners[type].forEach((cb) => cb(payload));
			} else {
				console.warn(
					`[RoomSocket] 핸들러가 없는 메시지 수신: ${type}`,
					payload,
				);
			}
		} catch (err) {
			console.error("[RoomSocket] 잘못된 메시지 형식:", data);
		}
	}

	public createRoom(data: {
		roomName: string;
		capacity: number;
		turnTime: number;
	}) {
		this.send({ type: "create", payload: data });
	}

	public joinRoom(data: { roomId: number }) {
		this.send({ type: "join", payload: data });
	}

	public quitRoom(data: { roomId: number }) {
		this.send({ type: "quit", payload: data });
	}

	public startGame(data: { roomId: number }) {
		this.send({ type: "start-game", payload: data });
	}

	public on(event: string, callback: (payload: any) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	public off(event: string, callback: (payload: any) => void) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter(
			(cb) => cb !== callback,
		);
	}

	public onJoinedRoom(callback: (payload: any) => void) {
		this.on("joined-room", callback);
	}

	public onRoomusers(callback: (payload: any) => void) {
		this.on("room-users", callback);
	}

	public offRoomusers(callback: (payload: any) => void) {
		this.off("room-users", callback);
	}

	public onCreateRoom(callback: (payload: any) => void) {
		this.on("created-room", callback);
	}
}

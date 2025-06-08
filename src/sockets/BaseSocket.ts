export abstract class BaseSocket {
	protected socket: WebSocket | null = null;
	protected path: string;
	protected query: Record<string, string>;

	constructor(path: string, query: Record<string, string> = {}) {
		this.path = path;
		this.query = query;

		const queryString = new URLSearchParams(query).toString();
		const baseUrl = import.meta.env.VITE_WS_BASE_URL;
		const url = `${baseUrl}${this.path}?${queryString}`;

		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			console.log(`[${this.path}] WebSocket 연결됨`);
			this.onOpen();
		};

		this.socket.onmessage = (event) => {
			this.onMessage(event.data);
		};

		this.socket.onerror = (event) => {
			console.error(`[${this.path}] WebSocket 오류 발생`, event);
		};

		this.socket.onclose = (event) => {
			console.warn(`[${this.path}] WebSocket 연결 종료됨`, event);
			this.onClose();
		};
	}

	protected onOpen(): void {}

	protected abstract onMessage(data: string): void;

	protected onClose(): void {}

	protected send(data: any): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
		} else {
			console.warn(`[${this.path}] WebSocket 연결이 열려있지 않음`);
		}
	}

	public isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN;
	}

	public disconnect(): void {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
}

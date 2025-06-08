import { create } from "zustand";

type MessageHandler<T = any> = (msg: T) => void;

interface HandlerMap {
	[type: string]: Set<MessageHandler>;
}

interface SocketHandlerMap {
	[socketType: string]: HandlerMap;
}

export type SocketType = "room" | "game" | (string & {});

interface SocketState {
	roomSocket: WebSocket | null;
	gameSocket: WebSocket | null;
	actions: {
		open: (type: SocketType, token: string) => void;
		isConnected: (type: SocketType) => boolean;
		close: (type: SocketType) => void;
		send: (type: SocketType, data: string | object) => void;
		registerHandler: <T = unknown>(
			socketType: SocketType,
			type: string,
			cb: MessageHandler<T>,
		) => void;
		unregisterHandler: (
			socketType: SocketType,
			type: string,
			cb: MessageHandler,
		) => void;
	};
}

const socketHandlerMap: SocketHandlerMap = {};

const addHandler = <T = unknown>(
	socketType: string,
	type: string,
	cb: MessageHandler<T>,
) => {
	if (!socketHandlerMap[socketType]) {
		socketHandlerMap[socketType] = {};
	}
	const handlerMap = socketHandlerMap[socketType];
	if (!handlerMap[type]) {
		handlerMap[type] = new Set();
	}
	handlerMap[type].add(cb);
};

/** Remove a previously registered handler */
const removeHandler = (
	socketType: string,
	type: string,
	cb: MessageHandler,
) => {
	socketHandlerMap[socketType]?.[type]?.delete(cb);
};

/** Fire all handlers listening to this socket/type */
const fireHandlers = (socketType: string, type: string, msg: any) => {
	socketHandlerMap[socketType]?.[type]?.forEach((cb) => {
		try {
			cb(msg);
		} catch (err) {
			console.error("Message handler error", err);
		}
	});
};

function getSocketFromState(
	state: SocketState,
	type: SocketType,
): WebSocket | null {
	return type === "room" ? state.roomSocket : state.gameSocket;
}

function setSocketInState(
	set: (partial: Partial<SocketState>) => void,
	type: SocketType,
	ws: WebSocket | null,
) {
	set(type === "room" ? { roomSocket: ws } : { gameSocket: ws });
}

// --- Zustand store ---

const SocketStore = create<SocketState>((set, get) => ({
	roomSocket: null,
	gameSocket: null,
	actions: {
		open: (type, token) => {
			const currentSocket = getSocketFromState(get(), type);
			if (
				currentSocket &&
				(currentSocket.readyState === WebSocket.CONNECTING ||
					currentSocket.readyState === WebSocket.OPEN)
			) {
				return;
			}
			setSocketInState(set, type, null);

			try {
				const ws = new WebSocket(
					`${import.meta.env.VITE_WS_BASE_URL}/${type}?token=${token}`,
				);

				ws.onopen = () => setSocketInState(set, type, ws);
				ws.onclose = () => setSocketInState(set, type, null);
				ws.onerror = () => setSocketInState(set, type, null);

				ws.onmessage = (ev) => {
					let msg;
					try {
						msg = JSON.parse(ev.data);
					} catch {
						return;
					}
					if (msg?.type) {
						fireHandlers(type, msg.type, msg);
					}
				};
			} catch (e) {
				console.error("WebSocket open error:", e);
			}
		},

		isConnected: (type) => {
			const socket = getSocketFromState(get(), type);
			return !!socket && socket.readyState === WebSocket.OPEN;
		},

		close: (type) => {
			const socket = getSocketFromState(get(), type);
			if (socket) {
				socket.close();
				setSocketInState(set, type, null);
			}
		},

		send: (type, data) => {
			const socket = getSocketFromState(get(), type);
			if (socket && socket.readyState === WebSocket.OPEN) {
				const payload = typeof data === "string" ? data : JSON.stringify(data);
				socket.send(payload);
			}
		},

		registerHandler: addHandler,
		unregisterHandler: removeHandler,
	},
}));

SocketStore((state) => ({
	gameSocket: state.gameSocket,
	roomSocket: state.roomSocket,
}));

export const useSocketActions = () => SocketStore((state) => state.actions);

import { create } from "zustand";

type MessageHandler<T = any> = (msg: T) => void;
interface HandlerMap {
	[type: string]: Set<MessageHandler>;
}
interface SocketHandlerMap {
	[type: string]: HandlerMap;
}
const socketHandlerMap: SocketHandlerMap = {};
const addHandler = <T = unknown>(
	socketType: string,
	type: string,
	cb: MessageHandler<T>,
) => {
	const handlerMap = socketHandlerMap[socketType];
	if (!handlerMap) {
		socketHandlerMap[socketType] = {};
		socketHandlerMap[socketType][type] = new Set();
		socketHandlerMap[socketType][type].add(cb);
	} else {
		if (!handlerMap[type]) {
			handlerMap[type] = new Set();
		}
		handlerMap[type].add(cb);
	}
};
const removeHandler = (
	socketType: string,
	type: string,
	cb: MessageHandler,
) => {
	const handlerMap = socketHandlerMap[socketType];
	handlerMap?.[type]?.delete(cb);
};
const fireHandlers = (socketType: string, type: string, msg: any) => {
	const handlerMap = socketHandlerMap[socketType];
	handlerMap?.[type]?.forEach((cb) => {
		try {
			cb(msg);
		} catch (err) {
			console.error("Message handler error", err);
		}
	});
};

type SocketType = "room" | "game";

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

function getSocketFromState(state: SocketState, type: SocketType) {
	return type === "room" ? state.roomSocket : state.gameSocket;
}

function setSocketInState(set: any, type: SocketType, ws: WebSocket | null) {
	if (type === "room") set({ roomSocket: ws });
	else set({ gameSocket: ws });
}

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
					if (msg?.type) fireHandlers(type, msg.type, msg);
				};
			} catch (e) {
				console.log(e);
			}
		},

		isConnected: (type) => {
			const socket = getSocketFromState(get(), type);
			return socket?.readyState === WebSocket.OPEN;
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

export const useSocket = () =>
	SocketStore((state) => ({
		gameSocket: state.gameSocket,
		roomSocket: state.roomSocket,
	}));
export const useSocketActions = () => SocketStore((state) => state.actions);

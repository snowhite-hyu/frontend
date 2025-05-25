import { io, Socket } from "socket.io-client";

export abstract class BaseSocket {
    protected socket: Socket;
    protected path: string;

    constructor(path: string, query: Record<string, string>) {
        this.path = path;
        
        this.socket = io(import.meta.env.VITE_WS_BASE_URL, {
            path: this.path,
            withCredentials: true,
            query,
        });

        this.socket.on("connect", () => console.log(`[${this.path}] Socket connected:`, this.socket.id));
        this.socket.on("disconnect", () => console.log(`[${this.path}] Socket disconnected`));
        this.socket.on("error", (err) => console.error(`[${this.path}] Socket error:`, err));
    }

    // 서버로 이벤트 전송
    protected emit(type: string, payload: any) {
        if (this.socket.connected) {
          this.socket.emit(type, payload);
        } else {
          console.warn(`[${this.path}] 소켓이 아직 연결되지 않았습니다.`);
        }
    }

    // 이벤트 수신용
    protected on(event: string, callback: (...args: any[]) => void) {
        this.socket.on(event, callback);
    }

    // 연결 상태 체크용 메서드
    public isConntected() {
        return this.socket.connected;
    }
    
    public disconnect() {
        this.socket.removeAllListeners(); // disconnect 전에 이벤트 정리
        this.socket.disconnect();
    }
}
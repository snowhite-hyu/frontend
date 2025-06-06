// import { create } from "zustand";
// import { RoomSocket } from "@/sockets/RoomSocket";

// interface RoomSocketState {
//     socket: RoomSocket | null;
//     connect: (jwtToken: string) => void;
//     disconnect: () => void;
// }

// export const useRoomSocketStore = create<RoomSocketState>((set, get) => ({
//     socket: null,

//     connect: (jwtToken: string) => {
//         const existingSocket = get().socket;
//         if(existingSocket) {
//             existingSocket?.disconnect(); // 기존 소켓 연결 해제
//         }
//         const socket = new RoomSocket(jwtToken);
//         set({ socket: socket });
//     },
    
//     disconnect: () => {
//         const socket = get().socket;
//         if (socket) {
//             socket.disconnect();
//             set({ socket: null });
//         }
//     },

// }));

import { create } from "zustand";
import { RoomSocket } from "@/sockets/RoomSocket";

interface RoomSocketState {
    socket: RoomSocket | null;
    connect: (jwtToken: string) => RoomSocket;
    disconnect: () => void;
}

export const useRoomSocketStore = create<RoomSocketState>((set, get) => ({
    socket: null,

    connect: (jwtToken: string) => {
        const existingSocket = get().socket;
        if (existingSocket) {
            existingSocket.disconnect(); // 기존 소켓 연결 해제
        }

        const socket = new RoomSocket(jwtToken);
        set({ socket });
        return socket;
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
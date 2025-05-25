import { create } from "zustand";
import { RoomUserModel } from "@/models/common/User";
import { RoomItem } from "@/models/common/Room";

interface RoomInfoState {
    room: RoomItem | null;
    setRoom: (room: any) => void;
    updateUsers: (users: RoomUserModel[]) => void;
    clearRoom: () => void;
}

export const useRoomInfoStore = create<RoomInfoState>((set) => ({
    room: null,
    setRoom: (room) => set({ room }),
    updateUsers: (users) => set((state) => state.room ? { room: {...state.room, users } }: {}),
    clearRoom: () => set({ room: null }),
}));
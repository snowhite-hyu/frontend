import { create } from "zustand";
import update from "immutability-helper";
import { WsRoomUserModel } from "@/models/common/User";
import { ChatResponse, RoomItem } from "@/models/common/Room";

interface RoomInfoState {
  room: RoomItem | null;
  setRoom: (room: any) => void;
  chats: ChatResponse[];
  updateUsers: (users: WsRoomUserModel[]) => void;
  pushChat: (value: RoomInfoState["chats"][number]) => void;
  clearChat: () => void;
  clearRoom: () => void;
}

export const useRoomInfoStore = create<RoomInfoState>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  chats: [],
  updateUsers: (users) => set((state) => state.room ? { room: { ...state.room, users } } : {}),
  pushChat: (value) => set((state) => {
    let newChats: RoomInfoState["chats"];
    if (state.chats.length >= 100) {
      newChats = update(state.chats, {
        $splice: [[0, 1]],
        $push: [value],
      });
    } else {
      newChats = update(state.chats, { $push: [value] });
    }
    return { chats: newChats };
  }),
  clearChat: () => set({ chats: [] }),
  clearRoom: () => set({ room: null }),
}));

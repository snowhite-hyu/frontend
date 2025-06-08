import { create } from "zustand";
import update from "immutability-helper";
import { WsRoomUserModel } from "@/models/common/User";
import { ChatResponse, RoomItem } from "@/models/common/Room";

interface RoomInfoState {
	room: RoomItem | null;
	isMaster: boolean;
	chats: ChatResponse[];
	setRoom: (room: any) => void;
	clearRoom: () => void;
	updateUsers: (users: WsRoomUserModel[]) => void;
	setIsMaster: (value: RoomInfoState["isMaster"]) => void;
	pushChat: (value: RoomInfoState["chats"][number]) => void;
	clearChat: () => void;
}

export const useRoomInfoStore = create<RoomInfoState>((set) => ({
	room: null,
	isMaster: false,
	chats: [],
	setRoom: (room) => set({ room }),
	clearRoom: () => set({ room: null }),
	updateUsers: (users) =>
		set((state) => (state.room ? { room: { ...state.room, users } } : {})),
	setIsMaster: (value) => set({ isMaster: value }),
	pushChat: (value) =>
		set((state) => {
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
}));

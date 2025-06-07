import { create } from "zustand";
import { RoomItem } from "@/models/common/Room";
import update from "immutability-helper";

interface RoomInfoState {
	room: RoomItem | null;
	isMaster: boolean;
	setRoom: (room: RoomInfoState["room"]) => void;
	updateUsers: (users: RoomItem["users"]) => void;
	clearRoom: () => void;
	setIsMaster: (value: RoomInfoState["isMaster"]) => void;
}

export const useRoomInfoStore = create<RoomInfoState>((set) => ({
	room: null,
	isMaster: false,
	gameId: null,
	setRoom: (room) => set({ room }),
	updateUsers: (users) =>
		set((state) =>
			state.room ? update(state, { room: { users: { $set: users } } }) : state,
		),
	clearRoom: () => set({ room: null }),
	setIsMaster: (value) => set({ isMaster: value }),
}));

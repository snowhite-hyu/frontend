import type { RoomData } from "@/models/room/Room";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RoomState {
	room: RoomData | null;
	isMaster: boolean;
	gameId: number | null;
	actions: {
		setRoom: (callback: (prev: RoomState["room"]) => RoomState["room"]) => void;
		setIsMaster: (value: RoomState["isMaster"]) => void;
		setGameId: (value: RoomState["gameId"]) => void;
	};
}

const RoomStore = create<RoomState>()(
	persist(
		(set) => ({
			room: null,
			isMaster: false,
			gameId: null,
			actions: {
				setRoom: (callback) => set((prev) => ({ room: callback(prev.room) })),
				setIsMaster: (value: RoomState["isMaster"]) => set({ isMaster: value }),
				setGameId: (value: RoomState["gameId"]) => set({ gameId: value }),
			},
		}),
		{
			name: "roomStore",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				room: state.room,
				isMaster: state.isMaster,
				gameId: state.gameId,
			}),
		},
	),
);

export const useRoomState = () => RoomStore((state) => state);
export const useRoomActions = () => RoomStore((state) => state.actions);

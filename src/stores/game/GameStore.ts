import type { GameData, RoundFinishedRes } from "@/models/game/Game";
import { PlayerData } from "@/models/game/Player";
import { create } from "zustand";

interface GameState {
	data: GameData | null;
	myInfo: PlayerData | null;
	roundReview?: RoundFinishedRes["payload"] | null;
	actions: {
		setGameData: (value: GameState["data"] | ((value: GameState["data"]) => GameState["data"])) => void;
		setMyInfo: (value: GameState["myInfo"] | ((value: GameState["myInfo"]) => GameState["myInfo"])) => void;
		setRoundReview: (value: GameState["roundReview"]) => void;
	};
}

export const GameStore = create<GameState>((set) => ({
	socket: null,
	data: null,
	myInfo: null,
	roundReview: null,
	actions: {
		setGameData: (value) => {
			if (value instanceof Function) {
				set((prev) => ({ data: value(prev.data) }));
			} else {
				set({ data: value });
			}
		},
		setMyInfo: (value) => {
			if (value instanceof Function) {
				set((prev) => ({ myInfo: value(prev.myInfo) }));
			} else {
				set({ myInfo: value })
			}
		},
		setRoundReview: (value) => set({ roundReview: value }),
	},
}));

export const useGameData = () => GameStore((state) => state.data);
export const useGameMyInfo = () => GameStore((state) => state.myInfo);
export const useGameActions = () => GameStore((state) => state.actions);

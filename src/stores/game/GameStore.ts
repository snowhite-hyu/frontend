import type { GameData, RoundFinishedRes } from "@/models/game/Game";
import { PlayerData } from "@/models/game/Player";
import { create } from "zustand";

interface GameState {
	data: GameData | null;
	myInfo: PlayerData | null;
	roundReview?: RoundFinishedRes["payload"] | null;
	actions: {
		setGameData: (value: GameState["data"]) => void;
		setMyInfo: (value: GameState["myInfo"]) => void;
		setRoundReview: (value: GameState["roundReview"]) => void;
	};
}

const GameStore = create<GameState>((set) => ({
	socket: null,
	data: null,
	myInfo: null,
	roundReview: null,
	actions: {
		setGameData: (value) => set({ data: value }),
		setMyInfo: (value) => set({ myInfo: value }),
		setRoundReview: (value) => set({ roundReview: value }),
	},
}));

export const useGameData = () => GameStore((state) => state.data);
export const useGameMyInfo = () => GameStore((state) => state.myInfo);
export const useGameActions = () => GameStore((state) => state.actions);

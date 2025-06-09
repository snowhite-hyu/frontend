import type { GameData, RoundFinishedRes } from "@/models/game/Game";
import type { PlayerData } from "@/models/game/Player";
import update from "immutability-helper";
import { create } from "zustand";

interface GameState {
	data: GameData | null;
	myInfo: PlayerData | null;
	roundReviews: RoundFinishedRes["payload"][];
	actions: {
		setGameData: (
			value:
				| GameState["data"]
				| ((value: GameState["data"]) => GameState["data"]),
		) => void;
		setMyInfo: (
			value:
				| GameState["myInfo"]
				| ((value: GameState["myInfo"]) => GameState["myInfo"]),
		) => void;
		pushRoundReview: (value: GameState["roundReviews"][number]) => void;
	};
}

export const GameStore = create<GameState>((set) => ({
	socket: null,
	data: null,
	myInfo: null,
	roundReviews: [],
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
				set({ myInfo: value });
			}
		},
		pushRoundReview: (value) =>
			set((prev) => ({
				roundReviews: update(prev.roundReviews, { $push: [value] }),
			})),
	},
}));

export const useGameData = () => GameStore((state) => state.data);
export const useGameMyInfo = () => GameStore((state) => state.myInfo);
export const useGameRoundReviews = () =>
	GameStore((state) => state.roundReviews);
export const useGameActions = () => GameStore((state) => state.actions);

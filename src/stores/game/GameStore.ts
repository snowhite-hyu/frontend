import type { GameData } from "@/models/game/Game";
import { PlayerData } from "@/models/game/Player";
import update from "immutability-helper";
import { create } from "zustand";

interface GameState {
	data: GameData | null;
	myInfo: PlayerData | null;
	hash: string;
	actions: {
		dropCardToBaord: (card: number, row: number, col: number) => void;
		swapHandCard: (id: string, lhsId: string, rhsId: string) => void;
		hasCardInHand: (id: string, cardId: string) => boolean;
		applyServerState: (data: Partial<GameData>) => void;
		setGameData: (
			callback: (value: GameState["data"]) => GameState["data"],
		) => void;
		setMyInfo: (value: GameState["myInfo"]) => void;
	};
}

const GameStore = create<GameState>((set, get) => ({
	socket: null,
	data: null,
	myInfo: null,
	hash: "",
	actions: {
		dropCardToBaord: (card, row, col) => {
			const state = get();
			const data = update(state.data, {
				field: {
					[row]: {
						[col]: {
							$set: [card, 0],
						},
					},
				},
			});
			set({ data });
		},
		swapHandCard: (id, lhsId, rhsId) => {
			const state = get();
			const gameData = state.data;
			if (gameData == null) return;
		},
		hasCardInHand: (id, cardId) => {
			const state = get();
			return true;
		},
		applyServerState: (data: Partial<GameData>) => {
			const state = get();
			if (state.data) {
				set({ data: update(state.data, { $merge: data }) });
			} else {
				set({ data: data as GameData });
			}
		},
		setGameData: (callback) => set({ data: callback(get().data) }),
		setMyInfo: (value) => set({ myInfo: value }),
	},
}));

export const useGameData = () => GameStore((state) => state.data);
export const useGameMyInfo = () => GameStore((state) => state.myInfo);
export const useGameActions = () => GameStore((state) => state.actions);

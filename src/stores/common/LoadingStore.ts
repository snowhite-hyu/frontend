import { create } from "zustand";

interface LoadingState {
	isLoading: boolean;
	actions: {
		setIsLoading: (value: boolean) => void;
	};
}

const LoadingStore = create<LoadingState>((set) => {
	return {
		isLoading: true,
		actions: {
			setIsLoading: (value: boolean) => set({ isLoading: value }),
		},
	};
});

export const useIsLoading = () => LoadingStore((state) => state.isLoading);
export const useLoadingActions = () => LoadingStore((state) => state.actions);

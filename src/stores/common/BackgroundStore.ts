import backgroundImage from "@/assets/background.png";
import { create } from "zustand";

interface BackgroundState {
	isVisible: boolean;
	image: string;
	actions: {
		setIsVisible: (value: boolean) => void;
		setImage: (value: string) => void;
		setUseLayout: (value: boolean) =>void;
	};
	useLayout: boolean;
}

const BackgroundStore = create<BackgroundState>((set) => {
	return {
		isVisible: false,
		image: backgroundImage,
		actions: {
			setIsVisible: (value: boolean) => set({ isVisible: value }),
			setImage: (value: string) => set({ image: value }),
			setUseLayout: (value: boolean) => set({ useLayout: value }),
		},
		useLayout: true,
	};
});

export const useBackgroundIsVisible = () =>
	BackgroundStore((state) => state.isVisible);
export const useBackgroundImage = () => BackgroundStore((state) => state.image);
export const useBackgroundActions = () =>
	BackgroundStore((state) => state.actions);
export const useBackgroundLayout = () =>
	BackgroundStore((state) => state.useLayout);

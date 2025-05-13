import backgroundImage from "@/assets/background.png";
import { create } from "zustand";

interface BackgroundState {
	isVisible: boolean;
	image: string;
	actions: {
		setIsVisible: (value: boolean) => void;
		setImage: (value: string) => void;
	};
}

const BackgroundStore = create<BackgroundState>((set) => {
	return {
		isVisible: false,
		image: backgroundImage,
		actions: {
			setIsVisible: (value: boolean) => set({ isVisible: value }),
			setImage: (value: string) => set({ image: value }),
		},
	};
});

export const useBackgroundIsVisible = () =>
	BackgroundStore((state) => state.isVisible);
export const useBackgroundImage = () => BackgroundStore((state) => state.image);
export const useBackgroundActions = () =>
	BackgroundStore((state) => state.actions);

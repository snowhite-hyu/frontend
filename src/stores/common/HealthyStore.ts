import restService from "@/apis/common/RestClient";
import { create } from "zustand";

interface HealthyState {
	lastHandShake: number;
	actions: {
		checkHealth: () => void;
	};
}

const HealthyStore = create<HealthyState>((set, get) => {
	return {
		lastHandShake: Date.now(),
		actions: {
			checkHealth: () => {
				const oldState = get();
				const now = Date.now();
				if (now - oldState.lastHandShake > 1) {
					console.log("Tring to check health...");
					restService({method: 'get', url: '/health'})
						.then((response) => {
							if (response.code === '200') {
								set({ lastHandShake: Date.now() });
							}
						})
					  .catch((error) => {
					  	console.log(error);
					  });
				}
			},
		},
	};
});

export const useIsHealthy = () =>
	HealthyStore((state) => Date.now() - state.lastHandShake < 3);
export const useHealthyActions = () => HealthyStore((state) => state.actions);

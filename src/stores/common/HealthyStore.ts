import { create } from "zustand";

interface HealthyState {
  lastHandShake: number;
  actions: {
    checkHealth: () => void,
  };
}

const HealthyStore = create<HealthyState>((set, get) => {
  return {
    lastHandShake: Date.now(),
    actions: {
      checkHealth: () => {
        // Not implemented yet
        const oldState = get();
        const now = Date.now();
        if (now - oldState.lastHandShake > 1) {
          console.log('Tring to check health...');
          set({ lastHandShake: Date.now() });
        }
      },
    }
  };
});

export const useIsHealthy = () => HealthyStore((state) => (Date.now() - state.lastHandShake) < 3);
export const useHealthyActions = () => HealthyStore((state) => state.actions);

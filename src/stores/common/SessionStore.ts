import type { UserModel } from "@/models/common/User";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
	user: UserModel | null;
	actions: {
		setUser: (value: SessionState["user"]) => void;
	};
}

const SessionStore = create<SessionState>()(
	persist(
		(set) => ({
			user: null,
			actions: {
				setUser: (value) => set({ user: value }),
			},
		}),
		{
			name: "session-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export const useSessionUser = () => SessionStore((state) => state.user);
export const useSessionActions = () => SessionStore((state) => state.actions);

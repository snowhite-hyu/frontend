import { apiSerivce } from "@/apis/common/ApiClient";
import type { UserModel } from "@/models/common/User";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
	token: string | null;
	user: UserModel | null;
	actions: {
		setToken: (value: SessionState["token"]) => void;
		setUser: (value: SessionState["user"]) => void;
	};
}

const SessionStore = create<SessionState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			actions: {
				setToken: (value) => {
					if (value) {
						apiSerivce.defaults.headers.common['Authorization'] = `Bearer ${value}`;
					} else {
						delete apiSerivce.defaults.headers.common['Authorization'];
					}
					set({ token: value })
				},
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

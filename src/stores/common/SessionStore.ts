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
		clear: () => void;
	};
}

export const SessionStore = create<SessionState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			actions: {
				setToken: (value) => {
					if (value) {
						apiSerivce.defaults.headers.common.Authorization = `Bearer ${value}`;
					} else {
						apiSerivce.defaults.headers.common.Authorization = undefined;
					}
					set({ token: value });
				},
				setUser: (value) => set({ user: value }),
				clear: () => {
					apiSerivce.defaults.headers.common.Authorization = undefined;
					set({ token: null, user: null });
				},
			},
		}),
		{
			name: "session-storage",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				token: state.token,
				user: state.user,
			}),
		},
	),
);

export const useSessionToken = () => SessionStore((state) => state.token);
export const useSessionUser = () => SessionStore((state) => state.user);
export const useSessionActions = () => SessionStore((state) => state.actions);

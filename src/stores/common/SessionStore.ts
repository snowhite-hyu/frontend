import { Login, Register } from "@/apis/common/Login";
import type { LoginRequest, RegisterRequest } from "@/models/common/Login";
import type { UserModel } from "@/models/common/User";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionState {
	user: UserModel | null;
	actions: {
		login: (request: LoginRequest) => Promise<void>;
		register: (request: RegisterRequest) => Promise<void>;
		setUser: (value: SessionState["user"]) => void;
	};
}

const SessionStore = create<SessionState>()(
	persist(
		(set, get) => ({
			user: null,
			actions: {
				login: async (request) => {
					const response = await Login(request);

					if (response.user !== undefined) {
						set({ user: response.user });
					} else if (response.reason !== undefined) {
						toast(`${response.reason}`);
					} else {
						toast("Unknown Error");
					}
				},
				register: async (request) => {
					const response = await Register(request);

					if (response.user !== undefined) {
						await get().actions.login({
							id: request.id,
							password: request.password,
						});
					} else if (response.reason !== undefined) {
						toast(`${response.reason}`);
					} else {
						toast("Unknown Error");
					}
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

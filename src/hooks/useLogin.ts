import { Login, Register } from "@/apis/common/Login";
import type { LoginRequest, RegisterRequest } from "@/models/common/Login";
import { useSessionActions } from "@/stores/common/SessionStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useLogin = () => {
	const sessionActions = useSessionActions();
	const navigate = useNavigate();

	const login: (request: LoginRequest) => Promise<boolean> = async (
		request,
	) => {
		const response = await Login(request);

		if (response.user !== undefined) {
			sessionActions.setUser(response.user);
			return true;
		}

		if (response.reason !== undefined) {
			toast(`${response.reason}`);
		} else {
			toast("Unknown Error");
		}

		return false;
	};
	const register: (request: RegisterRequest) => Promise<boolean> = async (
		request,
	) => {
		const response = await Register({
			method: "post",
			url: "/register",
			data: request,
		});

		if (response.isSuccess) {
			const loginResult = await login({
				id: request.email,
				password: request.password,
			});
			if (loginResult === false) {
				navigate("/login");
			}
			return loginResult;
		}

		toast(`${response.message}`);
		return false;
	};

	return {
		login,
		register,
	};
};

export default useLogin;

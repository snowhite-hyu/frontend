import { CheckEmail, Login, Register } from "@/apis/common/Login";
import type {
	CheckEmailRequest,
	LoginRequest,
	RegisterRequest,
} from "@/models/common/Login";
import { useSessionActions } from "@/stores/common/SessionStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useLogin = () => {
	const sessionActions = useSessionActions();
	const navigate = useNavigate();

	const login: (request: LoginRequest) => Promise<boolean> = async (
		request,
	) => {
		const response = await Login({
			method: "post",
			url: "/users/login",
			data: request,
		});

		if (response.isSuccess) {
			// API 수정 필요
			const token = (response.result as String).split("access token: ")[1];
			sessionActions.setToken(token);
			navigate("/waiting");
			return true;
		}

		toast(`${response.message}`);

		return false;
	};
	const register: (request: RegisterRequest) => Promise<boolean> = async (
		request,
	) => {
		const response = await Register({
			method: "post",
			url: "/users/register",
			data: request,
		});

		if (response.isSuccess) {
			const loginResult = await login({
				email: request.email,
				password: request.password,
			});
			if (loginResult) {
				navigate("/waiting");
			} else {
				navigate("/login");
			}
			return loginResult;
		}

		toast(`${response.message}`);

		return false;
	};

	const checkEmail: (request: CheckEmailRequest) => Promise<boolean> = async (
		request,
	) => {
		const response = await CheckEmail({
			method: "post",
			url: "/users/check-email",
			data: request,
		});

		// API 수정 필요
		toast(`${response.result}`);

		return !(response.result as String).startsWith("사용 중");
	};

	return {
		login,
		register,
		checkEmail,
	};
};

export default useLogin;

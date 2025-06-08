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
			sessionActions.setToken(response.result.token);
			navigate("/room");
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
			if (response.result.isSuccess) {
				const loginResult = await login({
					email: request.email,
					password: request.password,
				});
				if (loginResult) {
					navigate("/room");
				} else {
					navigate("/login");
				}
				return loginResult;
			}

			toast(`${response.result.message}`);
		} else {
			toast(`${response.message}`);
		}

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

		console.log(response);

		if (response.isSuccess) {
			toast(response.result.message);
			return response.result.isExisting;
		}
		toast(response.message);

		return false;
	};

	return {
		login,
		register,
		checkEmail,
	};
};

export default useLogin;

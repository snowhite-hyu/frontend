import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "@/models/common/Login";
import { apiSerivce } from "./ApiClient";

export async function Login(request: LoginRequest): Promise<LoginResponse> {
	try {
		const result = await apiSerivce.post<LoginResponse>("/login", request);
		return result.data;
	} catch (error) {
		console.log(error);
		return {
			user: undefined,
			reason: "Failed to Login!",
		};
	}
}

export async function Register(
	request: RegisterRequest,
): Promise<RegisterResponse> {
	try {
		const result = await apiSerivce.post<LoginResponse>("/register", request);
		return result.data;
	} catch (error) {
		console.log(error);
		return {
			user: undefined,
			reason: "Failed to Reigster!",
		};
	}
}

import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "@/models/common/Login";
import { apiSerivce } from "./ApiClient";
import restService from "./RestClient";

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

export const Register = restService<RegisterRequest, RegisterResponse>;

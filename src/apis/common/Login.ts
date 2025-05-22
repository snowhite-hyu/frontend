import type {
	CheckEmailRequest,
	CheckEmailResponse,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "@/models/common/Login";
import restService from "./RestClient";

export const Login = restService<LoginRequest, LoginResponse>;
export const Register = restService<RegisterRequest, RegisterResponse>;
export const CheckEmail = restService<CheckEmailRequest, CheckEmailResponse>;

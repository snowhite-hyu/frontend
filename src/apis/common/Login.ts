import {
	type CheckEmailRequest,
	type CheckEmailResponse,
	type LoginRequest,
	type LoginResponse,
	type RegisterRequest,
	type RegisterResponse,
} from "@/models/common/Login";
import restService from "./RestClient";

export const Login = restService<LoginRequest, LoginResponse>;
export const Register = restService<RegisterRequest, RegisterResponse>;
export const CheckEmail = restService<CheckEmailRequest, CheckEmailResponse>;

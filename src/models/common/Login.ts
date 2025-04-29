import type { UserModel } from "./User";

export interface LoginRequest {
	id: string;
	password: string;
}

export interface LoginResponse {
	user?: UserModel;
	reason?: string;
}

export interface RegisterRequest extends LoginRequest {
	username: string;
	email?: string;
	phone?: string;
}

export interface RegisterResponse {
	user?: UserModel;
	reason?: string;
}

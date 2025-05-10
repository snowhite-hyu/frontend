import type { RegisterDto } from "@/generated/model";
import type { UserModel } from "./User";

export interface LoginRequest {
	id: string;
	password: string;
}

export interface LoginResponse {
	user?: UserModel;
	reason?: string;
}

export interface RegisterRequest extends UndefiendToDefiend<RegisterDto> {}
export interface RegisterResponse extends string {}

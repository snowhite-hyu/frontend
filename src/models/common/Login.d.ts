import type { UserModel } from "./User";

export interface RegisterDto {
	email?: string;
	username?: string;
	password?: string;
}

export interface RegisterResponseDto {
	isSuccess?: boolean;
	message?: string;
}

export interface LoginRequestDto {
	email?: string;
	password?: string;
}

export interface LoginResponseDto {
	token?: string;
}

export interface EmailDto {
	email?: string;
}

export interface EmailCheckResponseDto {
	isExisting?: boolean;
	message?: string;
}

export interface LoginRequest extends UndefiendToDefiend<LoginRequestDto> {}
export interface LoginResponse extends UndefiendToDefiend<LoginResponseDto> {}
export interface RegisterRequest extends UndefiendToDefiend<RegisterDto> {}
export interface RegisterResponse
	extends UndefiendToDefiend<RegisterResponseDto> {}
export interface CheckEmailRequest extends UndefiendToDefiend<EmailDto> {}
export interface CheckEmailResponse
	extends UndefiendToDefiend<EmailCheckResponseDto> {}

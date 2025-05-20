import type { EmailDto, LoginRequestDto, RegisterDto } from "@/generated/model";
import type { UserModel } from "./User";

export interface LoginRequest extends UndefiendToDefiend<LoginRequestDto> {}
export interface LoginResponse extends string {}
export interface RegisterRequest extends UndefiendToDefiend<RegisterDto> {}
export interface RegisterResponse extends string {}
export interface CheckEmailRequest extends UndefiendToDefiend<EmailDto> {}
export interface CheckEmailResponse extends string {}

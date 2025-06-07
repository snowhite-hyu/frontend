/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
	email?: string;
	username?: string;
	password?: string;
}

export interface ApiResponseRegisterResponseDto {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: RegisterResponseDto;
}

export interface RegisterResponseDto {
	isSuccess?: boolean;
	message?: string;
}

export interface LoginRequestDto {
	email?: string;
	password?: string;
}

export interface ApiResponseLoginResponseDto {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: LoginResponseDto;
}

export interface LoginResponseDto {
	token?: string;
}

export interface EmailDto {
	email?: string;
}

export interface ApiResponseEmailCheckResponseDto {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: EmailCheckResponseDto;
}

export interface EmailCheckResponseDto {
	isExisting?: boolean;
	message?: string;
}

export interface ApiResponseString {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: string;
}

export interface ApiResponseGetRoomResponse {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: GetRoomResponse;
}

export interface GetRoomResponse {
	roomList?: Room[];
}

export interface Room {
	/** @format int64 */
	roomId?: number;
	masterPlayer?: User;
	users?: User[];
	/** @format int32 */
	capacity?: number;
	/** @format int32 */
	turnTime?: number;
	playing?: boolean;
}

export interface User {
	/** @format int64 */
	id?: number;
	username?: string;
	loggedIn?: boolean;
}

export interface ApiResponseObject {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: object;
}

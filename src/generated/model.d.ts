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

export interface ApiResponseString {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: string;
}

export interface LoginRequestDto {
	email?: string;
	password?: string;
}

export interface EmailDto {
	email?: string;
}

export interface ApiResponseObject {
	isSuccess?: boolean;
	code?: string;
	message?: string;
	result?: object;
}

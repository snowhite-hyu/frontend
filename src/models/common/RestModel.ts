type Method = "get" | "post" | "delete" | "patch";

export interface RestReqest<T> {
	method: Method;
	url: string;
	data?: T;
}

export interface RestResponse<T> {
	method: Method;
	code: string;
	message: string;
	data: T | null;
}

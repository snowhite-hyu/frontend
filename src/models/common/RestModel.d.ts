import type { ApiResponseObject } from "@/generated/model";

type Method = "get" | "post" | "delete" | "patch";

export interface RestReqest<T> {
	method: Method;
	url: string;
	data?: T;
}

export type RestResponse<T> = UndefiendToDefiend<ApiResponseObject> & {
	result?: T;
};

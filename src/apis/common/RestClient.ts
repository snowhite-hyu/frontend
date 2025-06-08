import type { RestReqest, RestResponse } from "@/models/common/RestModel";
import type { AxiosResponse } from "axios";
import { apiSerivce } from "./ApiClient";

async function restService<REQ, RES>(
	request: RestReqest<REQ>,
): Promise<RestResponse<RES>> {
	let response: AxiosResponse<RestResponse<RES>>;
	switch (request.method) {
		case "get":
			response = await apiSerivce.get(request.url, {});
			break;
		case "post":
			response = await apiSerivce.post(request.url, request.data, {});
			break;
		case "delete":
			response = await apiSerivce.delete(request.url, {});
			break;
		case "patch":
			response = await apiSerivce.patch(request.url, request.data, {});
			break;
		default:
			response = await apiSerivce.get(request.url, {});
	}

	return response.data;
}

export default restService;

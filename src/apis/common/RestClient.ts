import type { RestReqest, RestResponse } from "@/models/common/RestModel";
import { apiSerivce } from "./ApiClient";

async function restService<REQ, RES>(
	request: RestReqest<REQ>,
): Promise<RestResponse<RES>> {
	switch (request.method) {
		case "get":
			return await apiSerivce.get(request.url, {});
		case "post":
			return await apiSerivce.post(request.url, request.data, {});
		case "delete":
			return await apiSerivce.delete(request.url, {});
		case "patch":
			return await apiSerivce.patch(request.url, request.data, {});
		default:
			return await apiSerivce.get(request.url, {});
	}
}

export default restService;

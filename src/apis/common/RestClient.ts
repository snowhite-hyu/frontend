import type { RestReqest, RestResponse } from "@/models/common/RestModel";
import service from "./ApiClient";

async function restService<REQ, RES>(
	request: RestReqest<REQ>,
): Promise<RestResponse<RES>> {
	switch (request.method) {
		case "get":
			return await service.get(request.url, {});
		case "post":
			return await service.post(request.url, request.data, {});
		case "delete":
			return await service.delete(request.url, {});
		case "patch":
			return await service.patch(request.url, request.data, {});
		default:
			return await service.get(request.url, {});
	}
}

export default restService;

import axios, { type AxiosHeaders } from "axios";

type ServiceType = "api" | "asset";

const service = (type: ServiceType) => {
	let baseURL: string;
	let headers: Partial<AxiosHeaders>;

	switch (type) {
		case "api":
			baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
			headers = {
				"Cache-Control": "no-cache",
			};
			break;
		case "asset":
			baseURL = `${import.meta.env.VITE_ASSET_BASE_URL}`;
			headers = {};
			break;
	}

	return axios.create({
		baseURL: baseURL,
		headers: headers,
		withCredentials: true,
		validateStatus: (status) => {
			return status < 500;
		},
	});
};

export const apiSerivce = service("api");
export const assetService = service("asset");

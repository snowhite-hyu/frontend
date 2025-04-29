import axios from "axios";

type ServiceType = "api" | "asset";

const service = (type: ServiceType) => {
	let baseURL: string;
	switch (type) {
		case "api":
			baseURL = `${import.meta.env.API_BASE_URL}`;
			break;
		case "asset":
			baseURL = `${import.meta.env.ASSET_BASE_URL}`;
			break;
	}

	return axios.create({
		baseURL: baseURL,
		headers: {
			"Cache-Control": "no-cache",
		},
	});
};

export const apiSerivce = service("api");
export const assetService = service("asset");

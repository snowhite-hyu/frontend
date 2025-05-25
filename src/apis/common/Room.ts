import type { ListResponse } from "@/models/common/Room";
import restService from "./RestClient";

export const List = restService<undefined, ListResponse>;

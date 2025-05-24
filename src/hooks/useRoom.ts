import { List } from "@/apis/common/Room";
import type { ListResponse } from "@/models/common/Room";
import { toast } from "sonner";

const useRoom = () => {
	const list: () => Promise<ListResponse | false> = async () => {
		const response = await List({
			method: "get",
			url: "/api/rooms",
		});

		if (response.isSuccess) {
			return response.result; // RoomItem[]
		}
		toast(`${response.message}`);

		return false;
	};
	return {
		list,
	};
};

export default useRoom;

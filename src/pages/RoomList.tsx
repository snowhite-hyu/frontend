import background from "@/assets/background.png";
import { Button } from "@/components/ui/button";
import useRoom from "@/hooks/useRoom";
import type { RoomItem } from "@/models/common/Room";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomSocketStore } from "@/stores/common/RoomSocketStore";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useSessionToken } from "@/stores/common/SessionStore";

const RoomListPage: React.FC = () => {
	const navigate = useNavigate();
	const { setImage, setUseLayout } = useBackgroundActions();
	const { list } = useRoom();
	const token = useSessionToken();
	const setIsMaster = useRoomInfoStore((state) => state.setIsMaster);

	const [rooms, setRooms] = useState<RoomItem[]>([]);

	const { connect } = useRoomSocketStore();

	useEffect(() => {
		setImage(background);
		setUseLayout(true);
		fetchRooms();
		if (!token) {
			alert("로그인이 필요합니다.");
			return;
		}
		connect(token);
	}, []);

	const fetchRooms = async () => {
		const result = await list();
		if (result) {
			setRooms(result.roomList);
		}
	};

	const handleJoinRoom = (roomId: number) => {
		const roomSocket = useRoomSocketStore.getState().socket;
		if (roomSocket) {
			roomSocket.onJoinedRoom((payload) => {
				useRoomInfoStore.getState().setRoom(payload);
				navigate("/waiting");
				setIsMaster(false);
			});

			roomSocket.joinRoom({ roomId });
		}
	};

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<div className="flex flex-col w-full mt-[10%] mr-[10%] ml-auto">
				<div className="w-full max-w-[500px] min-w-[300px] h-[339px] rounded-[21.87px] bg-[#ffffff] mr-0 ml-auto p-[30px]">
					<div className="h-full overflow-y-auto">
						{rooms.length === 0 ? (
							<div className="w-full h-full flex justify-center items-center">
								<p className="text-[#999999] text-[20px] text-center">
									방이 없습니다.
								</p>
							</div>
						) : (
							rooms.map((room) => (
								<div
									key={room.roomId}
									className="w-full flex flex-inline mb-[10px] items-center "
								>
									<p className="text-[#000000] text-[25px] ml-[0%] mr-auto max-w-[350px] overflow-hidden">
										{room.roomName}
									</p>
									<Button
										variant={"saboteurCheck"}
										className="h-fit mr-[0%] ml-auto text-[21px]"
										onClick={() => handleJoinRoom(room.roomId)}
									>
										참가
									</Button>
								</div>
							))
						)}
					</div>
				</div>
				<div className="flex w-[500px] justify-between mt-[3%] mr-0 ml-auto">
					<Button
						variant={"saboteurCheck"}
						className="w-fit h-fit bg-[#E0E0E0] text-[#B22222] font-extrabold"
						type="submit"
						onClick={() => fetchRooms()}
					>
						새로고침
					</Button>
					<Button
						variant={"sabotuer"}
						className="w-fit h-fit"
						type="submit"
						onClick={() => navigate("/create-room")}
					>
						생성
					</Button>
				</div>
			</div>
		</div>
	);
};

export default RoomListPage;

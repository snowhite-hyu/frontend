import type React from "react";
import { Button } from "@/components/ui/button";
import Profile from "@/components/ui/Profile";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useRoomSocketStore } from "@/stores/common/RoomSocketStore";

const WaitingPage: React.FC = () => {
	const room = useRoomInfoStore((state) => state.room);
	if (!room) return <p>로딩 중...</p>;

	const navigate = useNavigate();
	const { setImage, setUseLayout } = useBackgroundActions();
	
	useEffect(() => {
		setImage(roomBackground);
		setUseLayout(false);

		const socket = useRoomSocketStore.getState().socket;
		const updateUsers = useRoomInfoStore.getState().updateUsers;
		
		if (!socket) return;
		
		const handleMessage = (users: any) => {
			updateUsers(users);
		};

		socket.onRoomusers(handleMessage);
		return () => socket.offRoomusers(handleMessage);

	}, [setImage, setUseLayout]);

	const options: { key: string; title: string; setting: string }[] = [
		{ key: "people", title: "최대 인원", setting: room.capacity+"명" },
		{ key: "time", title: "턴 시간 제한", setting: room.turnTime+"초" },
	];

	const [currentPage, setCurrentPage] = useState(0);

	const membersPerPage = 8;
	const totalPages = Math.ceil(room.users.length / membersPerPage);

	const start = currentPage * membersPerPage;
	const currentMembers = room.users.slice(start, start + membersPerPage);

	return (
		<div className="overflow-hidden">
			{/* 상단부 */}
			<div className="flex w-full h-full justify-between items-center mt-[50px] px-[3%]">
				{/* 방 제목 */}
				<div className="rounded-[21px] bg-[#0000004D] w-[50%] h-[110px] pl-[40px] pt-[27px] mr-[38px]">
					<p className="font-semibold text-[43px]">{room.roomId}</p>
				</div>
				{/* 옵션 설정 */}
				<div className="flex justify-center items-center">
					{options.map((option) => (
						<div
							key="options"
							className="flex justify-center items-center mr-[28px]"
						>
							<Button
								key={option.key}
								variant={"saboteurCheck"}
								size="custom"
								className="font-semibold text-[25.51px] px-[15px] py-[18px] mr-[16px]"
							>
								{option.title}
							</Button>
							<p className="text-[36px]">{option.setting}</p>
						</div>
					))}
				</div>
			</div>
			{/* 중앙부 */}
			<div className="w-full flex flex-col items-center mt-[40px]">
				<div className="grid grid-cols-4 grid-rows-2 gap-10 w-[80%] h-[450px]">
					{currentMembers.map((member) => (
						<Profile key={member.id} nickname={member.id.toString()} />
					))}
				</div>
				{/* 페이지 버튼 */}
				{totalPages > 1 && (
					<div className="flex mt-[50px] gap-2 ">
						{Array.from({ length: totalPages }).map((_, i) => (
							<button
								type="button"
								key={`page-${i}`}
								onClick={() => setCurrentPage(i)}
								className={`w-2 h-2 rounded-full ${
									i === currentPage ? "bg-black" : "bg-gray-200"
								}`}
							/>
						))}
					</div>
				)}
			</div>
			{/* 하단부 */}
			<div className="absolute bottom-0 w-full flex justify-between px-[3%]">
				{/* 채팅창 */}
				<div className="rounded-t-[21px] bg-[#0000004D] w-[500px] h-[140px]">
					<div className="absolute bottom-0 bg-[#0000003D] w-[500px] h-[44px] text-[#ffffff5D] pl-[13px] flex items-center">
						텍스트를 입력해주세요
					</div>
				</div>
				{/* 나가기 & 시작 버튼 */}
				<div className="gap-[50px]">
					<Button key="exit" variant={"exit"} className="h-fit mr-[50px]" onClick={() => navigate("/room")}>
						나가기
					</Button>
					<Button
						key="start"
						variant={"sabotuer"}
						size="custom"
						className="w-[160px] h-[88px]"
					>
						시작
					</Button>
				</div>
			</div>
		</div>
	);
};

export default WaitingPage;

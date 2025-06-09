import roomBackground from "@/assets/room.png";
import Profile from "@/components/ui/Profile";
import { Button } from "@/components/ui/button";
import useGame from "@/hooks/useGame";
import type { ChatResponse } from "@/models/common/Room";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useRoomSocketStore } from "@/stores/common/RoomSocketStore";
import { useGameData } from "@/stores/game/GameStore";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WaitingPage: React.FC = () => {
	const { room, isMaster, updateUsers, chats, pushChat, clearChat } =
		useRoomInfoStore((state) => state);
	const socket = useRoomSocketStore((state) => state.socket);
	const { open, init, join } = useGame();
	const game = useGameData();
	const navigate = useNavigate();
	if (!room) return <p>로딩 중...</p>;
	console.log(game);
	if (game != null && game.deckSize > 0) navigate("/game");

	const { setImage, setUseLayout } = useBackgroundActions();

	useEffect(() => {
		setImage(roomBackground);
		setUseLayout(false);

		if (!socket) return;

		const handleMessage = (users: any) => {
			updateUsers(users);
		};

		const handleChat = (msg: ChatResponse) => {
			pushChat(msg);
		};

		socket.onRoomusers(handleMessage);
		socket.onChat(handleChat);
		open();
		return () => {
			socket.offRoomusers(handleMessage);
			socket.offChat(handleChat);
			clearChat();
		};
	}, []);

	const options: { key: string; title: string; setting: string }[] = [
		{ key: "people", title: "최대 인원", setting: `${room.capacity}명` },
		{ key: "time", title: "턴 시간 제한", setting: `${room.turnTime}초` },
	];

	const [currentPage, setCurrentPage] = useState(0);

	const membersPerPage = 8;
	const totalPages = Math.ceil(room.users.length / membersPerPage);
	const currentMembers = useMemo(() => {
		const start = currentPage * membersPerPage;
		return room.users.slice(start, start + membersPerPage);
	}, [room.users]);

	const handleQuitRoom = (roomId: number) => {
		if (socket) {
			socket.quitRoom({ roomId });
		}
	};

	const handleStartGame = (roomId: number) => {
		if (!socket) return;
		if (isMaster) {
			socket.startGame({ roomId });
			setTimeout(() => {
				join(roomId);
			}, 500);
		} else {
			join(roomId);
		}
		init();
	};

	const chatViewRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (chatViewRef.current) {
			chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
		}
	}, [chats]);
	const [message, setMessage] = useState<string>("");
	const sendChat = () => {
		if (socket) {
			socket?.sendMessage({
				roomId: room.roomId,
				message,
			});
			setMessage("");
		}
	};

	const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "Enter") sendChat();
	};

	return (
		<div className="overflow-hidden">
			{/* 상단부 */}
			<div className="flex w-full h-full justify-between items-center mt-[50px] px-[3%]">
				{/* 방 제목 */}
				<div className="rounded-[21px] bg-[#0000004D] w-[50%] h-[110px] pl-[40px] pt-[27px] mr-[38px]">
					<p className="font-semibold text-[43px]">{room.roomName}</p>
				</div>
				{/* 옵션 설정 */}
				<div className="flex justify-center items-center">
					{options.map((option) => (
						<div
							key={option.key}
							className="flex justify-center items-center mr-[28px]"
						>
							<Button
								key={option.key}
								variant="saboteurCheck"
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
						<Profile key={member.id} nickname={member.username.toString()} />
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
				<div className="rounded-t-[21px] bg-[#0000004D] w-[500px] h-[140px] flex flex-col">
					{/* 채팅 메시지 뷰 */}
					<div ref={chatViewRef} className="flex-1 overflow-y-auto px-2 py-2">
						{chats.length ? (
							chats.slice(-20).map((chat: ChatResponse) => (
								<div key={chat.user.id} className="mb-1">
									<span className="font-bold text-white">
										{chat.user.username}:{" "}
									</span>
									<span className="text-white">{chat.message}</span>
								</div>
							))
						) : (
							<div className="text-gray-400 text-sm">
								아직 메시지가 없습니다.
							</div>
						)}
					</div>
					{/* 입력창 */}
					<div className="flex items-center border-t bg-[#0000003D] w-full h-[44px] px-2">
						<input
							type="text"
							className="flex-1 bg-transparent text-white outline-none"
							value={message}
							placeholder="텍스트를 입력해주세요"
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<button
							className="ml-2 text-white"
							onClick={sendChat}
							disabled={!message.trim()}
							type="button"
						>
							전송
						</button>
					</div>
				</div>
				{/* 나가기 & 시작 버튼 */}
				<div className="gap-[50px]">
					<Button
						key="exit"
						variant="exit"
						className="h-fit mr-[50px]"
						onClick={() => {
							handleQuitRoom(room.roomId);
							navigate("/room");
						}}
					>
						나가기
					</Button>
					<Button
						key="start"
						variant="sabotuer"
						size="custom"
						className="w-[160px] h-[88px]"
						onClick={() => handleStartGame(room.roomId)}
					>
						{isMaster ? "시작" : "준비"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default WaitingPage;

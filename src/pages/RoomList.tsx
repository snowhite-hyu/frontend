import type React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import background from "@/assets/background.png";
import { useEffect } from "react";

const RoomListPage: React.FC = () => {
	const navigate = useNavigate();

	const { setImage, setUseLayout } = useBackgroundActions();

	useEffect(() => {
		setImage(background);
		setUseLayout(true);
	}, [setImage, setUseLayout]);

	const rooms: string[] = ["빨리 오세요 ~", "초보자 환영", "즐거운 게임해요"];

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<div className="flex flex-col w-full mt-[10%] mr-[10%] ml-auto">
				<div className="w-full max-w-[500px] min-w-[300px] h-[339px] rounded-[21.87px] bg-[#ffffff] mr-0 ml-auto pt-[26px] pl-[34px] pr-[26px]">
					{rooms.map((room) => (
						<div
							key={room}
							className="w-full flex flex-inline mb-[10px] items-center "
						>
							<p className="text-[#000000] text-[25px] ml-[0%] mr-auto">
								{room}
							</p>
							<Button
								variant={"saboteurCheck"}
								className="h-fit mr-[0%] ml-auto text-[21px]"
								onClick={() => navigate("/waiting")}
							>
								참가
							</Button>
						</div>
					))}
				</div>
				<Button
					variant={"sabotuer"}
					className="w-fit h-fit mt-[3%] mr-[0%] ml-auto"
					type="submit"
					onClick={() => navigate("/create-room")}
				>
					생성
				</Button>
			</div>
		</div>
	);
};

export default RoomListPage;

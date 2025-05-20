import type React from "react";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import gameEndImage from "@/assets/gameEnd.svg";
import replayImage from "@/assets/replay.svg";
import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TestDialog: React.FC = () => {
	const [dialogStep, setDialogStep] = useState(0);
	const [isRoundEnd, setIsRoundEnd] = useState(false);

	const { setImage, setIsVisible, setUseLayout } = useBackgroundActions();
	const navigate = useNavigate();

	useEffect(() => {
		setImage(roomBackground);
		setIsVisible(true);
		setUseLayout(false);
	}, [setImage, setIsVisible, setUseLayout]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (dialogStep === 1 && e.key === "Enter") {
				setDialogStep(2);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dialogStep]);

	return (
		<div>
			<button
				type="button"
				onClick={() => setIsRoundEnd(true)}
				className="px-4 py-2 bg-red-500 rounded"
			>
				라운드 끝내기
			</button>
			<Dialog isOpen={isRoundEnd} setIsOpen={setIsRoundEnd}>
				<h2 className="text-4xl font-bold text-red-500">타이틀</h2>
				<p className="mt-2 text-white">설명</p>
			</Dialog>

			<button
				type="button"
				onClick={() => setDialogStep(1)}
				className="m-4 px-4 py-2 bg-blue-500 rounded"
			>
				게임 끝내기
			</button>
			<Dialog
				isOpen={dialogStep === 1}
				setIsOpen={() => setDialogStep(2)}
				size="small"
			>
				<div className="w-fit mb-5">
					<img
						src={gameEndImage}
						className="w-full h-fit object-fill object-bottom"
						aria-hidden={true}
					/>
				</div>
				<p className="font-semibold text-4xl">코딩정령</p>
				<p className="font-semibold text-3xl">총 금덩이 개수 100개</p>
			</Dialog>
			<Dialog
				isOpen={dialogStep === 2}
				setIsOpen={() => setDialogStep(0)}
				size="small"
			>
				<div className="w-fit mb-5">
					<img
						src={replayImage}
						className="w-full h-fit object-fill object-bottom"
						aria-hidden={true}
					/>
				</div>
				<p className="font-semibold text-4xl mb-5">재밌으셨나요?</p>
				<div className="flex gap-7">
					<Button
						variant={"replay"}
						className="w-fit h-fit opacity-50"
						type="submit"
						onClick={() => navigate("/waiting")}
					>
						나가기
					</Button>
					<Button
						variant={"replay"}
						className="w-fit h-fit opacity-90"
						type="submit"
						onClick={() => navigate("/waiting")}
					>
						다시하기
					</Button>
				</div>
			</Dialog>
		</div>
	);
};

export default TestDialog;

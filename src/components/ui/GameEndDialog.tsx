import { useNavigate } from "react-router-dom";
import Dialog from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import gameEndImage from "@/assets/gameEnd.svg";
import replayImage from "@/assets/replay.svg";
import { useEffect, useState } from "react";

interface GameEndDialogProps {
	winner: string;
	gold: number;
}

const GameEndDialog: React.FC<GameEndDialogProps> = ({ winner, gold }) => {
	const [dialogStep, setDialogStep] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Enter") return;

			switch (dialogStep) {
				case 1:
					setDialogStep(2);
					break;
				case 2:
					e.preventDefault();
					navigate("/waiting");
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dialogStep, navigate]);

	if (dialogStep === 0) return null;

	return (
		<>
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
				<p className="font-semibold text-4xl">{winner}</p>
				<p className="font-semibold text-3xl">총 금덩이 개수 {gold}개</p>
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
						type="button"
						variant={"replay"}
						className="w-fit h-fit opacity-50"
						onClick={() => navigate("/waiting")}
					>
						나가기
					</Button>
					<Button
						type="button"
						variant={"replay"}
						className="w-fit h-fit opacity-90"
						onClick={() => navigate("/waiting")}
					>
						다시하기
					</Button>
				</div>
			</Dialog>
		</>
	);
};

export default GameEndDialog;

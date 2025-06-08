import { useNavigate } from "react-router-dom";
import Dialog from "@/components/ui/dialog/Dialog";
import { Button } from "@/components/ui/button";
import gameEndImage from "@/assets/gameEnd.svg";
import replayImage from "@/assets/replay.svg";
import { useEffect, useMemo, useState } from "react";
import { RoundFinishedRes } from "@/models/game/Game";

interface GameEndDialogProps {
	roundReview: RoundFinishedRes["payload"];
}

const GameEndDialog: React.FC<GameEndDialogProps> = ({ roundReview }) => {
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

	const winners = useMemo(
		() =>
			roundReview.players.filter(
				(player) => player.role === roundReview.winnerRole,
			),
		[roundReview],
	);
	const winnersGold: number = useMemo(() => {
		return winners.reduce((prev, cur) => prev + cur.gainedGold, 0);
	}, []);

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
				{winners.map((winner) => (
					<p key={winner.playerId} className="font-semibold text-4xl">
						{winner.playerName}
					</p>
				))}
				<p className="font-semibold text-3xl">총 금덩이 개수 {winnersGold}개</p>
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

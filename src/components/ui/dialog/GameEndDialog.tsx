import Dialog from "@/components/ui/dialog/Dialog";
import { Button } from "@/components/ui/button";
import gameEndImage from "@/assets/gameEnd.svg";
import replayImage from "@/assets/replay.svg";
import { useEffect, useMemo, useState } from "react";
import { RoundFinishedRes } from "@/models/game/Game";

interface GameEndDialogProps {
	roundReviews: RoundFinishedRes["payload"][];
	onExit: () => void | Promise<void>;
}

const GameEndDialog: React.FC<GameEndDialogProps> = ({
	roundReviews,
	onExit,
}) => {
	const [dialogStep, setDialogStep] = useState(1);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "Enter") return;

			switch (dialogStep) {
				case 1:
					setDialogStep(2);
					break;
				case 2:
					e.preventDefault();
					onExit();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [dialogStep]);

	const { winners, maxGold } = useMemo(() => {
		const goldMap = new Map<number, { gold: number; playerName: string }>();
		roundReviews.forEach((round) => {
			round.players.forEach((player) => {
				if (!goldMap.has(player.playerId)) {
					goldMap.set(player.playerId, {
						gold: 0,
						playerName: player.playerName,
					});
				}
				const entry = goldMap.get(player.playerId)!;
				entry.gold += player.gainedGold;
			});
		});

		let max = 0;
		goldMap.forEach((v) => {
			if (v.gold > max) max = v.gold;
		});
		const winnersArr = Array.from(goldMap)
			.filter(([, v]) => v.gold === max)
			.map(([playerId, v]) => ({
				playerId,
				playerName: v.playerName,
				gold: v.gold,
			}));
		return { winners: winnersArr, maxGold: max };
	}, [roundReviews]);

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
				<p className="font-semibold text-3xl">총 금덩이 개수 {maxGold}개</p>
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
						onClick={onExit}
					>
						나가기
					</Button>
					<Button
						type="button"
						variant={"replay"}
						className="w-fit h-fit opacity-90"
						onClick={onExit}
					>
						다시하기
					</Button>
				</div>
			</Dialog>
		</>
	);
};

export default GameEndDialog;

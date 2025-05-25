import type React from "react";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import { useState, useEffect } from "react";

import GameEndDialog from "@/components/ui/GameEndDialog";
import RoundEndDialog from "@/components/ui/RoundEndDialog";

const TestDialog: React.FC = () => {
	const [isRoundEnd, setIsRoundEnd] = useState(false);
	const [isGameEnd, setIsGameEnd] = useState(false);

	const { setImage, setIsVisible, setUseLayout } = useBackgroundActions();

	useEffect(() => {
		setImage(roomBackground);
		setIsVisible(true);
		setUseLayout(false);
	}, [setImage, setIsVisible, setUseLayout]);

	const miners: string[] = [
		"광부 1",
		"광부 2",
		"광부 3",
		"광부 4",
		"광부 5",
	];

	const saboteurs: string[] = [
		"방해꾼 1",
		"방해꾼 2",
	];

	return (
		<div>
			<button
				type="button"
				onClick={() => setIsRoundEnd(!isRoundEnd)}
				className="px-4 py-2 bg-red-500 rounded"
			>
				{isRoundEnd ? "리셋" : "라운드 끝내기"}
			</button>
			{isRoundEnd && (
				<RoundEndDialog
					saboteurs={saboteurs}
					miners={miners}
					winner={"광부들"} // "광부들" 또는 "방해꾼들"
				/>
			)}
			<button
				type="button"
				onClick={() => setIsGameEnd(!isGameEnd)}
				className="m-4 px-4 py-2 bg-blue-500 rounded"
			>
				{isGameEnd ? "리셋" : "게임 끝내기"}
			</button>
			{isGameEnd && (
				<GameEndDialog
					winner={"코딩정령"}
					gold={Math.floor(Math.random() * 101)}
				/>
			)}
		</div>
	);
};

export default TestDialog;

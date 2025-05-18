import type React from "react";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import { useState, useEffect } from "react";
import Dialog from "@/components/ui/Dialog";

const TestDialog: React.FC = () => {
    const [isRoundEnd, setIsRoundEnd] = useState(false);
    const [isGameEnd, setIsGameEnd] = useState(false);

	const { setImage, setIsVisible, setUseLayout } = useBackgroundActions();
	useEffect(() => {
		setImage(roomBackground);
		setIsVisible(true);
		setUseLayout(false);
	}, [setImage, setIsVisible, setUseLayout]);

	return (
		<div>
            <button onClick={() => setIsRoundEnd(true)} className="px-4 py-2 bg-red-500 rounded">
				라운드 끝내기
			</button>
            <Dialog isOpen={isRoundEnd} setIsOpen={setIsRoundEnd}> 
				<h2 className="text-4xl font-bold text-red-500">타이틀</h2>
				<p className="mt-2 text-white">설명</p>
			</Dialog>	

			<button onClick={() => setIsGameEnd(true)} className="m-4 px-4 py-2 bg-blue-500 rounded">
				게임 끝내기
			</button>
			<Dialog isOpen={isGameEnd} setIsOpen={setIsGameEnd} size="small"> 
				<h2 className="text-4xl font-bold text-red-500">타이틀</h2>
				<p className="mt-2 text-white">설명</p>
			</Dialog>		
		</div>
	);
};

export default TestDialog;

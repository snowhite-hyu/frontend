import Dialog from "@/components/ui/Dialog";
import { useEffect, useState } from "react";

import Text from "@/components/ui/text";

import SaboteurCard from "@/assets/roleCard/saboteur.png";
import MinerCard from "@/assets/roleCard/miner.png";
import GoldCard from "@/assets/goldCard.png";

interface RoundEndDialogProps {
    saboteurs: string[];
    miners: string[];
    winner: string;
}

const RoundEndDialog: React.FC<RoundEndDialogProps> = ({ saboteurs, miners, winner  }) => {
    const [dialogStep, setDialogStep] = useState(1);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return;

            switch (dialogStep) {
                case 1:
                    setDialogStep(2);
                    break;
                case 2:
                    e.preventDefault();
                    setDialogStep(0);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dialogStep]);

    if (dialogStep === 0) return null;

    return (
        <>
            {/* Step 1: 역할 공개 */}
            <Dialog isOpen={dialogStep === 1} setIsOpen={() => setDialogStep(2)}>
					<Text className="text-9xl">Role Reveal</Text>
					<div className="flex mt-17 w-[700px] h-[250px] space-between mb-17">
						<div className="flex">
							<img src={SaboteurCard} className="w-[156px] h-[244px]"></img>
							<div className="flex flex-col justify-center w-[200px]">
								{saboteurs.map((saboteur) => (
									<p className="text-white text-3xl font-bold pl-[30px] pr-[30px] mb-3">{saboteur}</p>
								))
								}
							</div>
						</div>
						<div className="flex ml-10">
							<img src={MinerCard} className="w-[156px] h-[244px]"></img>
							<div className="flex flex-col justify-center w-[200px]">
								{miners.map((miner) => (
									<p className="text-white text-3xl font-bold pl-[30px] pr-[30px] mb-3">{miner}</p>
								))}
							</div>
						</div>
					</div>
			</Dialog>
            {/* Step 2: 승자 발표 및 금 배분 */}
            <Dialog isOpen={dialogStep === 2} setIsOpen={() => setDialogStep(0)}>
                <Text className="text-9xl text-yellow-600">Dividing Gold ...</Text>
                <div className="flex flex-col mt-5">
                    <img src={GoldCard}></img>
                    <p className="text-white text-3xl font-bold items-center">승자는 <span className={ winner === "광부들" ? "text-yellow-600" : "text-red-600"}>{winner}</span>입니다!</p>
                    <p className="text-white text-2xl font-bold mt-3">금덩이를 자동으로 배분합니다...</p>
                </div>
			</Dialog>
        </>
    );
};

export default RoundEndDialog;
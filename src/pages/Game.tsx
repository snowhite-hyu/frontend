import type React from "react";
import { useEffect } from "react";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import PlayerPanel from "@/components/ui/PlayerPanel";
import remainCard from "@/assets/card/routeH1.png";
import transhCan from "@/assets/trash.png";
import rotateIcon from "@/assets/rotate.png";

import routeCard from "@/assets/card/routeTRBL1.png";
import roleCard from "@/assets/roleCard/saboteur.png";

const GamePage: React.FC = () => {
	const { setImage, setUseLayout } = useBackgroundActions();

	useEffect(() => {
		setImage(roomBackground);
		setUseLayout(false);
	}, [setImage, setUseLayout]);

	type ToolState = "normal" | "broken";

	type Player = {
		id: number;
		name: string;
		card: number;
		gold: number;
		tools: {
			lantern: ToolState;
			cart: ToolState;
			pickaxe: ToolState;
		};
	};

    const players: Player[] = [
        { id: 1, name: "신데렐라", card: 1, gold: 1, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        { id: 2, name: "앨리스", card: 2, gold: 2, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
        { id: 3, name: "백설공주", card: 3, gold: 3, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        { id: 4, name: "오로라", card: 4, gold: 4, tools: {lantern: "normal", cart: "broken", pickaxe: "broken"} },
        { id: 5, name: "벨", card: 5, gold: 5, tools: {lantern: "normal", cart: "broken", pickaxe: "broken"} },
        { id: 6, name: "엘사", card: 6, gold: 6, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
        { id: 7, name: "자스민", card: 7, gold: 7, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
        { id: 8, name: "뮬란", card: 8, gold: 8, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
        { id: 9, name: "애리얼", card: 9, gold: 9, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
        { id: 10, name: "NAME", card: 10, gold: 10, tools: {lantern: "normal", cart: "normal", pickaxe: "normal"} },
    ];

	const leftPlayers: Player[] = [];
	const rightPlayers: Player[] = [];

	players.forEach((player, index) => {
		if (index % 2 === 0) {
			leftPlayers.push(player); // 짝수 번째 플레이어 -> 왼쪽
		} else {
			rightPlayers.push(player); // 홀수 번째 플레이어 -> 오른쪽
		}
	});

	return (
		<div className="relative h-screen">
			{/* 플레이어 패널 */}
			<div className="flex justify-between pt-10">
				<div className="flex flex-col gap-3">
					{leftPlayers.map((player) => (
						<PlayerPanel key={player.id} player={player} position="left" />
					))}
				</div>
				<div className="flex flex-col gap-3 items-end">
					{rightPlayers.map((player) => (
						<PlayerPanel key={player.id} player={player} position="right" />
					))}
				</div>
			</div>
            {/* 남은 카드 */}
            <div className="absolute bottom-2 left-75">
                <img src={remainCard} className="w-18" />
                <p className="absolute top-1 left-1/2 -translate-x-1/2 text-white text-lg font-holtwood">64</p>
            </div>
            {/* 카드 덱 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2"> 
                <div className="flex gap-5 w-[580px] h-42 bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 overflow-hidden">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="group flex flex-col justify-between items-center shrink-0 w-[72px]">
                            <img
                                src={rotateIcon}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {}} // 카드 회전 기능 추가 필요
                            />
                            <img
                                src={routeCard}
                                className="w-full h-auto object-contain rounded-sm border border-white self-end"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* 버리기 */}
            <div className="absolute bottom-2 right-75 h-28">
                <div className="h-28 flex flex-col justify-between items-center">
                    <p className="text-white text-xl font-holtwood font-bold">버리기</p>
                    <img src={transhCan} className="w-19" />
                </div>
            </div>
            {/* 역할 카드 */}
            <div className="absolute bottom-0 right-13"> 
                <div className="w-37 h-42 bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 flex flex-col gap-1">
                    <p className="text-xl font-holtwood font-bold uppercase text-[#DF1E34] text-shadow-[0_-1.46px_0.73px_#FFFFFFCC,0_1.46px_2.19px_#000000]">ROLE</p>
                    <img src={roleCard} className="w-18 flex-1 object-contain mx-auto" />
                </div>
            </div>
		</div>
	);
};

export default GamePage;

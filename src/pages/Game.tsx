import type React from "react";
import { useEffect } from "react";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import PlayerPanel from "@/components/ui/PlayerPanel";

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
        { id: 1, name: "name", card: 1, gold: 1, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        { id: 2, name: "앨리스", card: 2, gold: 2, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        { id: 3, name: "백설공주", card: 3, gold: 3, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        { id: 4, name: "오로라", card: 4, gold: 4, tools: {lantern: "normal", cart: "broken", pickaxe: "normal"} },
        // { id: 5, name: "벨", card: 5, gold: 5 },
        // { id: 6, name: "엘사", card: 6, gold: 6 },
        // { id: 7, name: "자스민", card: 7, gold: 7 },
        // { id: 8, name: "뮬란", card: 8, gold: 8 },
        // { id: 9, name: "애리얼", card: 9, gold: 9 },
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
		<div>
			{/* 플레이어 패널 */}
			<div className="flex justify-between pt-16">
				<div className="flex flex-col gap-5">
					{leftPlayers.map((player) => (
						<PlayerPanel key={player.id} player={player} position="left" />
					))}
				</div>
				<div className="flex flex-col gap-5 items-end">
					{rightPlayers.map((player) => (
						<PlayerPanel key={player.id} player={player} position="right" />
					))}
				</div>
			</div>
		</div>
	);
};

export default GamePage;

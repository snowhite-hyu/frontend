import cardIcon from "@/assets/card/routeH1.png";
import cartIconA from "@/assets/icon/actionC.png";
import pickaxeIconA from "@/assets/icon/actionD.png";
import lanternIconA from "@/assets/icon/actionL.png";
import cartIconB from "@/assets/icon/blockC.png";
import pickaxeIconB from "@/assets/icon/blockD.png";
import lanternIconB from "@/assets/icon/blockL.png";
import goldIcon from "@/assets/icon/gold.png";
import { OpenPlayerState } from "@/models/game/Game";
import { PlayerData } from "@/models/game/Player";
import type React from "react";

interface PlayerPanelProps {
	player: OpenPlayerState;
	position: "left" | "right";
	isPlayerTurn: boolean;
	myInfo?: PlayerData;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
	player,
	position,
	isPlayerTurn,
	myInfo,
}) => {
	return (
		<div
			className={`${isPlayerTurn ? "h-36 w-66" : "h-24 w-50"} bg-white/60 p-3 flex flex-col justify-between ${position === "left" ? "rounded-tr-lg rounded-br-lg" : "rounded-tl-lg rounded-bl-lg"}`}
		>
			{/* 이름 + 골드 */}
			<div className="flex justify-between">
				<p className="text-xl font-holtwood font-bold uppercase text-[#DF1E34]">
					{myInfo?.playerId === player.playerId ? "나: " : ""}{player.playerName}
				</p>
				<div className="flex gap-2 items-center">
					<img src={goldIcon} className="w-auto h-6" />
					<p className="text-lg font-holtwood text-black">{player.gold}</p>
				</div>
			</div>
			{/* 카드 수 + 도구 */}
			<div className="flex justify-between">
				<div className="flex gap-2 items-center">
					<img src={cardIcon} className="w-auto h-8" />
					<p className="text-lg font-holtwood text-black">{player.handSize}</p>
				</div>
				<div className="flex gap-1.5 items-center [&>img]:w-auto [&>img]:h-8">
					<img
						src={
							!player.state.includes("BROKEN_LATERN")
								? lanternIconA
								: lanternIconB
						}
					/>
					<img
						src={
							!player.state.includes("BROKEN_MINECART") ? cartIconA : cartIconB
						}
					/>
					<img
						src={
							!player.state.includes("BROKEN_PICKAXE")
								? pickaxeIconA
								: pickaxeIconB
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default PlayerPanel;

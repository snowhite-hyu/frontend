import type React from "react";
import goldIcon from "@/assets/icon/gold.png";
import cardIcon from "@/assets/card/routeH1.png";
import lanternIconA from "@/assets/icon/actionL.png";
import cartIconA from "@/assets/icon/actionC.png";
import pickaxeIconA from "@/assets/icon/actionD.png";
import lanternIconB from "@/assets/icon/blockL.png";
import cartIconB from "@/assets/icon/blockC.png";
import pickaxeIconB from "@/assets/icon/blockD.png";

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

interface PlayerPanelProps {
	player: Player;
	position: "left" | "right";
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ player, position }) => {
	return (
		<div
			className={`h-24 w-48 bg-white/60 p-3 flex flex-col justify-between ${position === "left" ? "rounded-tr-lg rounded-br-lg" : "rounded-tl-lg rounded-bl-lg"}`}
		>
			<div className="flex justify-between">
				<p className="text-xl font-holtwood font-bold uppercase text-[#DF1E34]">
					{player.name}
				</p>
				<div className="flex gap-2 items-center">
					<img
						src={goldIcon}
						className="w-auto h-6"
					/>
					<p className="text-lg font-holtwood text-black">{player.gold}</p>
				</div>
			</div>
			<div className="flex justify-between">
				<div className="flex gap-2 items-center">
					<img
						src={cardIcon}
						className="w-auto h-8"
					/>
					<p className="text-lg font-holtwood text-black">{player.card}</p>
				</div>
				<div className="flex gap-2 items-center">
					<img
						src={player.tools.lantern === "normal" ? lanternIconA : lanternIconB}
						className="w-auto h-8"
					/>
					<img
						src={player.tools.cart === "normal" ? cartIconA : cartIconB}
						className="w-auto h-8"
					/>
					<img
						src={player.tools.pickaxe === "normal" ? pickaxeIconA : pickaxeIconB}
						className="w-auto h-8"
					/>
				</div>
			</div>
		</div>
	);
};

export default PlayerPanel;

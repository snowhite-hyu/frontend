import type React from "react";

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
				<div>
					<p className="text-lg font-holtwood text-black">{player.gold}</p>
				</div>
			</div>
			<div className="flex justify-between">
				<p className="text-lg font-holtwood text-black">{player.card}</p>
				<p></p>
			</div>
		</div>
	);
};

export default PlayerPanel;

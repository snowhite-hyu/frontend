import type React from "react";

export interface GameMapProps {
	width: number;
	height: number;
	renderCell?: (row: number, col: number) => React.ReactNode;
	style?: React.CSSProperties;
}

export const GameMap: React.FC<GameMapProps> = ({
	width,
	height,
	renderCell,
	style = {},
}) => {
	const grid = [];
	for (let row = 0; row < height; row++) {
		const line = [];
		for (let col = 0; col < width; col++) {
			line.push(
				<div
					key={`${row}-${col}`}
					style={{
						width: 74,
						height: 112,
						border: "1px solid #bbb",
						// background: "#fff",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						boxSizing: "border-box",
					}}
				>
					{renderCell?.(row, col)}
				</div>,
			);
		}
		grid.push(
			<div style={{ display: "flex" }} key={row}>
				{line}
			</div>,
		);
	}
	return (
		<div
			style={{
				// background: "#eee",
				display: "inline-block",
				...style,
			}}
		>
			{grid}
		</div>
	);
};

export default GameMap;

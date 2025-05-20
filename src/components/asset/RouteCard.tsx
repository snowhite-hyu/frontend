import Card from "./Card";

const directionMap: Record<"top" | "right" | "bottom" | "left", string> = {
	top: "T",
	right: "R",
	bottom: "B",
	left: "L",
};

const directionOrder: Array<"top" | "right" | "bottom" | "left"> = [
	"top",
	"right",
	"bottom",
	"left",
];

interface RouteCardProps {
	id: string;
	isHidden: boolean;
	isBlock: boolean;
	direction: Array<"top" | "right" | "bottom" | "left">;
	isDraggable?: boolean;
}

const RouteCard: React.FC<RouteCardProps> = ({
	id,
	isHidden,
	isBlock,
	direction,
	isDraggable = true,
}) => {
	let imgName = "card/route";
	if (isHidden) {
		imgName += "H";
	} else {
		if (isBlock) imgName += "D";
		const dirSet = new Set(direction);
		for (const dir of directionOrder) {
			if (dirSet.has(dir)) {
				imgName += directionMap[dir];
			}
		}
	}

	return <Card id={id} assetName={imgName} isDraggable={isDraggable} />;
};

export default RouteCard;

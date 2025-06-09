import Card from "./Card";

interface RouteCardProps {
	id: string;
	assetId: number;
	isDraggable?: boolean;
	isFlipped?: number;
}

const RouteMap: Record<string, string> = {
	0: "H",
	61: "TL",
	62: "BL",
	63: "TRBL",
};

const GoalCard: React.FC<RouteCardProps> = ({
	id,
	assetId,
	isDraggable = true,
	isFlipped = true,
}) => {
	if (isFlipped) {
		assetId = 0;
	}
	const imgName = `card/goal${RouteMap[assetId]}`;

	return <Card id={id} assetName={imgName} isDraggable={isDraggable} />;
};

export default GoalCard;

import Card from "./Card";

interface RouteCardProps {
	id: string;
	isHidden: boolean;
	assetId: number;
	isDraggable?: boolean;
}

const RouteMap: Record<string, string> = {
	0: "H",
	61: "TL",
	62: "BL",
	63: "TRBL",
};

const GoalCard: React.FC<RouteCardProps> = ({
	id,
	isHidden,
	assetId,
	isDraggable = true,
}) => {
	if (isHidden) {
		assetId = 0;
	}
	let imgName = "card/goal" + RouteMap[assetId];

	return <Card id={id} assetName={imgName} isDraggable={isDraggable} />;
};

export default GoalCard;

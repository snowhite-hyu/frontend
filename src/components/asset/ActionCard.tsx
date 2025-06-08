import Card from "./Card";

interface RouteCardProps {
	id: string;
	assetId: number;
	isDraggable?: boolean;
}

const RouteMap: Record<string, string> = {
	101: "card/actionD",
	102: "card/actionL",
	103: "card/actionC",
	104: "card/actionCL",
	105: "card/actionCD",
	106: "card/actionDL",
	107: "card/actionB",
	108: "card/actionM",
	109: "card/blockD",
	110: "card/blockL",
	111: "card/blockC",
};

const ActionCard: React.FC<RouteCardProps> = ({
	id,
	assetId,
	isDraggable = true,
}) => {
	return (
		<Card id={id} assetName={RouteMap[assetId]} isDraggable={isDraggable} />
	);
};

export default ActionCard;

import Card from "./Card";

interface RouteCardProps {
	id: string;
	isHidden: boolean;
	assetId: number;
	isDraggable?: boolean;
}

const RouteMap: Record<string, string> = {
	0: "H1",
	1: "TBL1",
	2: "TBL2",
	3: "TBL3",
	4: "TBL4",
	5: "TBL5",
	6: "TB1",
	7: "TB2",
	8: "TB3",
	9: "TB4",
	10: "RB1",
	11: "RB2",
	12: "RB3",
	13: "RB4",
	14: "BL1",
	15: "BL2",
	16: "BL3",
	17: "BL4",
	18: "BL5",
	19: "RBL1",
	20: "RBL2",
	21: "RBL3",
	22: "RBL4",
	23: "RBL5",
	24: "RL1",
	25: "RL2",
	26: "RL3",
	27: "TRBL1",
	28: "TRBL2",
	29: "TRBL3",
	30: "TRBL4",
	31: "TRBL5",
	32: "DTBL",
	33: "DB",
	34: "DL",
	35: "DRB",
	36: "DBL",
	37: "DRBL",
	38: "DTRBL",
	39: "DTB",
	40: "DRL",
};

const RouteCard: React.FC<RouteCardProps> = ({
	id,
	isHidden,
	assetId,
	isDraggable = true,
}) => {
	if (isHidden) {
		assetId = 0;
	}
	let imgName = "card/route" + RouteMap[assetId];

	return <Card id={id} assetName={imgName} isDraggable={isDraggable} />;
};

export default RouteCard;

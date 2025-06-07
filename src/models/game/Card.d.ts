export type CardType = "route" | "action" | "goal" | "start" | "gold" | "role";
export interface CardCommonData {
	id: string;
	type: CardType;
	isOpen: boolean;
}

export type RouteDirection = "top" | "right" | "bottom" | "left";
export interface RouteCardData extends CardCommonData {
	type: "route";
	direction: Array<RouteDirection>;
	isUpsideDown: boolean;
}

export interface GoalCardData extends RouteCardData {
	type: "goal";
}

export type DefaultActionType = "dig" | "lantern" | "cart";
export type BlockActionType =
	| "blockRoute"
	| "blockDig"
	| "blockLantern"
	| "blockCart";
export type ActionType =
	| Array<DefaultActionType>
	| DefaultActionType
	| BlockActionType
	| "map";
export interface ActionCardData extends CardCommonData {
	type: "action";
	actionType: ActionType;
}

export interface GoldCardData extends CardCommonData {
	type: "gold";
	value: number;
}

export interface RoleCardData extends CardCommonData {
	type: "role";
	isSaboteur: boolean;
}

export type CardData =
	| RouteCardData
	| GoalCardData
	| ActionCardData
	| GoldCardData
	| RoleCardData;

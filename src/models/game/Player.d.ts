import type { Payload } from "../common/Payload";
import { type ActionCardData, CardData, type RouteCardData } from "./Card";

export type PlayerRole = "DWARF" | "SABOTEUR";
export type PlayerState =
	| "NORMAL"
	| "BROKEN_PICKAXE"
	| "BROKEN_MINECART"
	| "BROKEN_LANTERN";

export interface PlayerData {
	playerId: number;
	playerName: string;
	playerRole: PlayerRole;
	hand: number[];
	state: PlayerState[];
	gold: number;
}

export type GetPlayerInfoReq = Payload<
	"get-player-info",
	{
		gameId: number;
	}
>;

export type GetPlayerInfoRes = Payload<"Player-Info", PlayerData>;

import type { Payload } from "../common/Payload";
import { CardData, GoalCardData, RouteCardData } from "./Card";
import { PlayerRole, PlayerState } from "./Player";

export type JoinGameReq = Payload<
	"join-game",
	{
		gameId: number;
	}
>;

export type JoinGameRes = Payload<
	"Game-Joined",
	{
		remainingPlayers: number;
	}
>;

export type RoundStartReq = Payload<
	"Start-Round",
	{
		gameId: number;
	}
>;

export type RoundStartRes = Payload<
	"Round-Started",
	{
		game: GameData;
	}
>;

type GameState = "WAITING" | "IN_GAME" | "FINISHED";
type FieldState = [number, number];
interface OpenPlayerState {
	playerId: number;
	playerName: string;
	handSize: number;
	state: PlayerState[];
	gold: number;
}

export interface GameData {
	gameId: number;
	players: OpenPlayerState[];
	joinedPlayerIds: number[];
	round: number;
	gameState: GameState;
	field: FieldState[][];
	deckSize: number;
	currentTurnPlayerId: number;
	turnTime: number;
}

export type GetGameStateReq = Payload<
	"get-game-state",
	{
		gameId: number;
	}
>;

export type GetGameStateRes = Payload<
	"Game-State",
	GameData,
>;

export type RoundFinishedRes = Payload<
	"Round-Finished",
	{
		winnerRole: PlayerRole;
		players: {
			playerId: number;
			playerName: string;
			role: PlayerRole;
			gainedGold: number;
		}[];
	}
>;

export type FieldUpdateOneRes = Payload<
	string,
	{ cardId: number; row: number; column: number; isFlipped?: number }
>;

export type PlayerInfoChanged = Payload<string, OpenPlayerState>;

export type TurnChangedRes = Payload<"Turn-Changed", { nextTurnPlayerId: number }>;

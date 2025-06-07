import type { Payload } from "../common/Payload";
import { CardData, GoalCardData, RouteCardData } from "./Card";
import { PlayerState } from "./Player";

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
	"start-round",
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

type GameState = "WAITING" | "IN_GAME";
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

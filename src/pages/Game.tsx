import remainCard from "@/assets/card/routeH1.png";
import roomBackground from "@/assets/room.png";
import transhCan from "@/assets/trash.png";
import PlayerPanel from "@/components/ui/PlayerPanel";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import saboteur from "@/assets/role/saboteur.png";
import worker from "@/assets/role/worker.png";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";
import { useGameData, useGameMyInfo } from "@/stores/game/GameStore";
import { OpenPlayerState } from "@/models/game/Game";
import Card from "@/components/asset/Card";
import RouteCard from "@/components/asset/RouteCard";
import ActionCard from "@/components/asset/ActionCard";
import { toast } from "sonner";
import useGame from "@/hooks/useGame";
import GameMap from "@/components/game/Map";
import GoalCard from "@/components/asset/GoalCard";
import { DroppableCell } from "@/components/game/DroppableCell";
import GameEndDialog from "@/components/ui/dialog/GameEndDialog";

const PLAYER_PREFIX = "player:";
const MAP_PREFIX = "map:";
const CARD_PREFIX = "card:";
const TRASHBIN = "trashbin";

const GamePage: React.FC = () => {
	const { setImage, setUseLayout } = useBackgroundActions();
	const game = useGameData();
	const myInfo = useGameMyInfo();

	const {
		init,
		deinit,
		getMyCards,
		dropMyCard,
		usePathCard,
		useBrokenCard,
		useMapCard,
		useRepairCard,
		useRockfallCard,
		forceUpdate,
	} = useGame();

	useEffect(() => {
		forceUpdate();
		() => deinit();
	}, []);

	useEffect(() => {
		setImage(roomBackground);
		setUseLayout(false);
	}, [setImage, setUseLayout]);

	const [leftPlayers, rightPlayers] = useMemo(() => {
		const leftPlayers: OpenPlayerState[] = [];
		const rightPlayers: OpenPlayerState[] = [];

		game?.players.forEach((player, index) => {
			if (index % 2 === 0) {
				leftPlayers.push(player); // 짝수 번째 플레이어 -> 왼쪽
			} else {
				rightPlayers.push(player); // 홀수 번째 플레이어 -> 오른쪽
			}
		});
		return [leftPlayers, rightPlayers];
	}, [game?.players]);

	const [flip, setFlip] = useState<number>(0);
	const flipIterval = useRef<NodeJS.Timeout>(null);
	const [activeItem, setActiveItem] = useState<string | null>(null);
	const activeOverlay = useMemo(() => {
		if (activeItem) {
			if (activeItem.startsWith(CARD_PREFIX)) {
				const assetId = Number.parseInt(activeItem.slice(CARD_PREFIX.length));
				if (0 < assetId && assetId < 60) {
					return (
						<RouteCard
							id={"overlay"}
							assetId={assetId}
							isDraggable={false}
							isHidden={false}
							flip={flip}
						/>
					);
				} else if (100 < assetId && assetId < 120) {
					return (
						<ActionCard id={"overlay"} assetId={assetId} isDraggable={false} />
					);
				}
			}
		}
		return <></>;
	}, [activeItem, flip]);
	const dragStart = (e: DragStartEvent) => {
		const activeId = e.active.id.toString();
		toast(`Drag start from ${activeId}`);
		setActiveItem(activeId);
		setFlip(0);
		if (activeId.startsWith(CARD_PREFIX) && flipIterval.current === null) {
			flipIterval.current = setInterval(() => {
				setFlip((prev) => (prev + 1) % 3);
			}, 500);
		}
	};
	const dragEnd = (e: DragEndEvent) => {
		const overId = e.over?.id.toString();
		const activeId = e.active.id.toString();
		if (flipIterval.current) {
			clearInterval(flipIterval.current);
			flipIterval.current = null;
		}
		if (overId === "trashbin" && activeId.startsWith(CARD_PREFIX)) {
			const id = Number.parseInt(activeId.slice(CARD_PREFIX.length));
			if (id) {
				toast(`Drop my card!`);
				dropMyCard(id);
			}
		} else if (
			overId?.startsWith(MAP_PREFIX) &&
			activeId.startsWith(CARD_PREFIX)
		) {
			const mapcolrow = overId.split(":");
			const row = Number.parseInt(mapcolrow[1]);
			const col = Number.parseInt(mapcolrow[2]);

			const cardId = Number.parseInt(activeId.slice(CARD_PREFIX.length));
			if (0 < cardId && cardId < 60) {
				usePathCard(cardId, row, col, flip);
			} else if (cardId === 107) {
				useRockfallCard(cardId, row, col);
			}
		} else if (
			overId?.startsWith(PLAYER_PREFIX) &&
			activeId.startsWith(CARD_PREFIX)
		) {
			const playerId = Number.parseInt(overId.slice(PLAYER_PREFIX.length));
			const cardId = Number.parseInt(activeId.slice(CARD_PREFIX.length));
			if (109 <= cardId && cardId <= 111) {
				useBrokenCard(cardId, playerId);
			}
		}
		setActiveItem(null);
	};

	return (
		<div className="relative h-screen">
			<DndContext onDragStart={dragStart} onDragEnd={dragEnd}>
				{/* 플레이어 패널 */}
				<div className="absolute w-full top-0 left-0 flex justify-between pt-10">
					<div className={`flex flex-col gap-3`}>
						{leftPlayers.map((player) => (
							<DroppableCell id={`${PLAYER_PREFIX}${player.playerId}`}>
								<PlayerPanel
									key={player.playerId}
									player={player}
									position="left"
									isPlayerTurn={game?.currentTurnPlayerId === player.playerId}
									myInfo={myInfo ?? undefined}
								/>
							</DroppableCell>
						))}
					</div>
					<div className={`flex flex-col gap-3 items-end`}>
						{rightPlayers.map((player) => (
							<PlayerPanel
								key={player.playerId}
								player={player}
								position="right"
								isPlayerTurn={game?.currentTurnPlayerId === player.playerId}
								myInfo={myInfo ?? undefined}
							/>
						))}
					</div>
				</div>
				{/* 맵 */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					{game && <MapGrid field={game?.field} />}
				</div>
				{/* 카드 덱 */}
				<div className="absolute flex bottom-0 left-1/2 -translate-x-1/2 items-end gap-4">
					{/* 남은 카드 */}
					<div>
						<img src={remainCard} className="w-18" />
						<p className="text-white text-lg font-holtwood">{game?.deckSize}</p>
					</div>
					<div className="flex gap-5 max-w-[580px] bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 overflow-auto">
						{myInfo?.hand.map((id) => (
							<div
								key={id}
								className="group flex flex-col justify-between items-center shrink-0 w-[72px]"
							>
								{id === 0 && <Card id={`card:${id}`} assetName="card/start" />}
								{id > 0 && id < 40 && (
									<RouteCard id={`card:${id}`} isHidden={false} assetId={id} />
								)}
								{id > 100 && id < 120 && (
									<ActionCard id={`card:${id}`} assetId={id} />
								)}
							</div>
						))}
					</div>
					{/* 버리기 */}
					<DroppableCell id={TRASHBIN}>
						<div className="">
							<div className="h-28 flex flex-col justify-between items-center">
								<p className="text-white text-xl font-holtwood font-bold">
									버리기
								</p>
								<img src={transhCan} className="w-19" />
							</div>
						</div>
					</DroppableCell>
					{/* 역할 카드 */}
					<div className="">
						<div className="flex flex-col bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 gap-1">
							<p className="text-xl font-holtwood font-bold uppercase text-[#DF1E34] text-shadow-[0_-1.46px_0.73px_#FFFFFFCC,0_1.46px_2.19px_#000000]">
								ROLE
							</p>
							<img
								src={myInfo?.playerRole === "SABOTEUR" ? saboteur : worker}
								className="w-18 flex-1 object-contain mx-auto"
							/>
						</div>
					</div>
				</div>
				<DragOverlay>{activeOverlay}</DragOverlay>
			</DndContext>
		</div>
	);
};

export default GamePage;

const MapGrid: React.FC<({ field: [number, number][][] })> = ({ field }) => {
	return (
		<GameMap height={field.length} width={field[0].length}
			renderCell={(row, col) => {
				const cell = field[row][col];
				const id = `${MAP_PREFIX}${row}:${col}`;
				if (!cell) return <div key={id}>{id}</div>;

				if (cell[0] === -1) return <DroppableCell id={id} key={id}>{id}</DroppableCell>;
				if (0 < cell[0] && cell[0] < 60)
					return (
						<DroppableCell id={id} key={id}>
							<RouteCard
								id={`disp-${id}`}
								assetId={cell[0]}
								isHidden={false}
								isDraggable={false}
								flip={cell[1]}
							/>
						</DroppableCell>
					);
				if (60 < cell[0] && cell[0] < 70)
					return <GoalCard id={id} assetId={cell[0]} isHidden={true} isDraggable={false} key={id} />;
				return <Card id="start-card" assetName="card/start" isDraggable={false} key={id} />;
			}}
		/>
	);
}

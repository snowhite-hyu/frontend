import { useMemo, useRef, useState, useEffect } from "react";
import remainCard from "@/assets/card/routeH1.png";
import roomBackground from "@/assets/room.png";
import trashCan from "@/assets/trash.png";
import saboteur from "@/assets/role/saboteur.png";
import worker from "@/assets/role/worker.png";
import PlayerPanel from "@/components/ui/PlayerPanel";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
} from "@dnd-kit/core";
import {
	useGameData,
	useGameMyInfo,
	useGameRoundReviews,
} from "@/stores/game/GameStore";
import { OpenPlayerState } from "@/models/game/Game";
import Card from "@/components/asset/Card";
import RouteCard from "@/components/asset/RouteCard";
import ActionCard from "@/components/asset/ActionCard";
import { toast } from "sonner";
import useGame from "@/hooks/useGame";
import GameMap from "@/components/game/Map";
import GoalCard from "@/components/asset/GoalCard";
import { DroppableCell } from "@/components/game/DroppableCell";
import RoundEndDialog from "@/components/ui/dialog/RoundEndDialog";
import GameEndDialog from "@/components/ui/dialog/GameEndDialog";
import { useNavigate } from "react-router-dom";

// 드래그 앤 드랍 대상 prefix
const PLAYER_PREFIX = "player:";
const MAP_PREFIX = "map:";
const CARD_PREFIX = "card:";
const GOAL_PREFIX = "goal:";
const TRASHBIN = "trashbin";

const GamePage: React.FC = () => {
	const { setImage, setUseLayout } = useBackgroundActions();
	const navigate = useNavigate();
	const game = useGameData();
	const roundReviews = useGameRoundReviews();
	const myInfo = useGameMyInfo();

	const {
		deinit,
		dropMyCard,
		usePathCard,
		useBrokenCard,
		useMapCard,
		useRepairCard,
		useRockfallCard,
		forceUpdate,
		startRound,
	} = useGame();

	useEffect(() => {
		forceUpdate();
		setImage(roomBackground);
		setUseLayout(false);
		return () => deinit();
	}, []);

	const [leftPlayers, rightPlayers] = useMemo(() => {
		const left: OpenPlayerState[] = [];
		const right: OpenPlayerState[] = [];
		game?.players.forEach((player, idx) =>
			(idx % 2 ? right : left).push(player),
		);
		return [left, right];
	}, [game?.players]);

	const [flip, setFlip] = useState<number>(0);
	const flipInterval = useRef<NodeJS.Timeout | null>(null);
	const [activeItem, setActiveItem] = useState<string | null>(null);

	// 현재 드래그중인 카드 오버레이
	const activeOverlay = useMemo(() => {
		if (!activeItem) return null;
		if (activeItem.startsWith(CARD_PREFIX)) {
			const assetId = Number.parseInt(activeItem.slice(CARD_PREFIX.length));
			if (assetId > 0 && assetId < 60) {
				return (
					<RouteCard
						id="overlay"
						assetId={assetId}
						isDraggable={false}
						isHidden={false}
						flip={flip}
					/>
				);
			}
			if (assetId > 100 && assetId < 120) {
				return (
					<ActionCard id="overlay" assetId={assetId} isDraggable={false} />
				);
			}
		}
		return null;
	}, [activeItem, flip]);

	// 드래그 시작: 오버레이와 flip 애니메이션 설정
	const handleDragStart = (e: DragStartEvent) => {
		const id = e.active.id.toString();
		toast(`드래그 시작: ${id}`);
		setActiveItem(id);
		setFlip(0);

		if (id.startsWith(CARD_PREFIX) && !flipInterval.current) {
			flipInterval.current = setInterval(
				() => setFlip((f) => (f + 1) % 3),
				500,
			);
		}
	};

	// 드래그 종료: 카드 드랍 처리 및 flip 인터벌 해제
	const handleDragEnd = (e: DragEndEvent) => {
		const overId = e.over?.id.toString();
		const activeId = e.active.id.toString();

		// flip 반복 종료
		if (flipInterval.current) {
			clearInterval(flipInterval.current);
			flipInterval.current = null;
		}

		if (activeId.startsWith(CARD_PREFIX)) {
			const cardId = Number.parseInt(activeId.slice(CARD_PREFIX.length));

			// 내 카드 버리기에 드랍
			if (overId === TRASHBIN && cardId) {
				toast("카드 버리기!");
				dropMyCard(cardId);

				// 맵 셀에 드랍 (길카드/암석낙하카드)
			} else if (overId?.startsWith(MAP_PREFIX)) {
				const [, rowStr, colStr] = overId.split(":");
				const row = Number(rowStr);
				const col = Number(colStr);

				if (cardId > 0 && cardId < 60) usePathCard(cardId, row, col, flip);
				else if (cardId === 107) useRockfallCard(cardId, row, col);

				// 골셀에 드랍 (지도카드)
			} else if (overId?.startsWith(GOAL_PREFIX)) {
				const [, rowStr, colStr] = overId.split(":");
				const row = Number(rowStr);
				const col = Number(colStr);

				// 지도카드는 특정 위치만 허용
				if ((row === 1 || row === 3 || row === 5) && col === 8) {
					useMapCard(cardId, row, col);
				}

				// 플레이어에 드랍 (수리/부서짐카드)
			} else if (overId?.startsWith(PLAYER_PREFIX)) {
				const playerId = Number.parseInt(overId.slice(PLAYER_PREFIX.length));
				if (cardId > 100 && cardId <= 104) {
					// 수리 카드별 대상 부위 매핑
					const states: Record<
						number,
						"BROKEN_PICKAXE" | "BROKEN_LANTERN" | "BROKEN_MINECART"
					> = {
						101: "BROKEN_PICKAXE",
						102: "BROKEN_LANTERN",
						103: "BROKEN_MINECART",
					};
					const targetState = states[cardId];
					if (targetState) useRepairCard(cardId, playerId, targetState);
				} else if (cardId >= 109 && cardId <= 111) {
					useBrokenCard(cardId, playerId);
				}
			}
		}

		setActiveItem(null);
	};

	// 라운드 종료 시 다이얼로그 표시
	const endModal = useMemo(() => {
		if (roundReviews.length == 0 || !game) return <></>;
		switch (game.gameState) {
			case "WAITING":
				return <></>;
			case "IN_GAME":
				if (game.round > 0) {
					// 라운드 인덱스 시작 1
					return (
						<RoundEndDialog
							roundReview={roundReviews[game.round - 1]}
							onExit={startRound}
						/>
					);
				} else {
					return <></>;
				}
			case "FINISHED":
				return (
					<GameEndDialog
						roundReviews={roundReviews}
						onExit={() => navigate("/waiting")}
					/>
				);
		}
	}, [roundReviews, game?.gameState]);

	return (
		<div className="relative h-screen">
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				{/* 플레이어 패널 (좌/우) */}
				<div className="absolute w-full top-0 left-0 flex justify-between pt-10">
					<div className="flex flex-col gap-3">
						{leftPlayers.map((player) => (
							<DroppableCell
								id={`${PLAYER_PREFIX}${player.playerId}`}
								key={player.playerId}
							>
								<PlayerPanel
									player={player}
									position="left"
									isPlayerTurn={game?.currentTurnPlayerId === player.playerId}
									myInfo={myInfo ?? undefined}
								/>
							</DroppableCell>
						))}
					</div>
					<div className="flex flex-col gap-3 items-end">
						{rightPlayers.map((player) => (
							<DroppableCell
								id={`${PLAYER_PREFIX}${player.playerId}`}
								key={player.playerId}
							>
								<PlayerPanel
									player={player}
									position="right"
									isPlayerTurn={game?.currentTurnPlayerId === player.playerId}
									myInfo={myInfo ?? undefined}
								/>
							</DroppableCell>
						))}
					</div>
				</div>
				{/* 맵 그리드 */}
				<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					{game && <MapGrid field={game.field} />}
				</div>
				{/* 카드 패, 쓰레기통, 역할카드 렌더링 */}
				<div className="absolute flex bottom-0 left-1/2 -translate-x-1/2 items-end gap-4">
					{/* 남은 카드 수 */}
					<div>
						<img src={remainCard} className="w-18" alt="남은카드" />
						<p className="text-white text-lg font-holtwood">{game?.deckSize}</p>
					</div>
					{/* 내 패(손패) */}
					<div className="flex gap-5 max-w-[580px] bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 overflow-auto">
						{myInfo?.hand.map((id, index) => (
							<div
								key={`${id}-${index}`}
								className="group flex flex-col justify-between items-center shrink-0 w-[72px]"
							>
								{id === 0 && (
									<Card id={`card:${id}:${index}`} assetName="card/start" />
								)}
								{id > 0 && id < 40 && (
									<RouteCard
										id={`card:${id}:${index}`}
										isHidden={false}
										assetId={id}
									/>
								)}
								{id > 100 && id < 120 && (
									<ActionCard id={`card:${id}:${index}`} assetId={id} />
								)}
							</div>
						))}
					</div>
					{/* 버리기 (쓰레기통) */}
					<DroppableCell id={TRASHBIN}>
						<div className="h-28 flex flex-col justify-between items-center">
							<p className="text-white text-xl font-holtwood font-bold">
								버리기
							</p>
							<img src={trashCan} className="w-19" alt="쓰레기통" />
						</div>
					</DroppableCell>
					{/* 역할 카드 */}
					<div>
						<div className="flex flex-col bg-black/30 rounded-tl-xl rounded-tr-xl pt-4 px-6 pb-2 gap-1 items-center">
							<p className="text-xl font-holtwood font-bold uppercase text-[#DF1E34] text-shadow-[0_-1.46px_0.73px_#FFFFFFCC,0_1.46px_2.19px_#000000]">
								ROLE
							</p>
							<img
								src={myInfo?.playerRole === "SABOTEUR" ? saboteur : worker}
								className="w-18 flex-1 object-contain mx-auto"
								alt="직업카드"
							/>
						</div>
					</div>
				</div>
				{/* 카드 드래그 오버레이 */}
				<DragOverlay>{activeOverlay}</DragOverlay>
			</DndContext>
			{/* 라운드 및 게임 종료 다이얼로그 출력 */}
			{endModal}
		</div>
	);
};

export default GamePage;

/**
 * 맵 렌더링용 별도 컴포넌트 (row, col별 셀 렌더)
 */
const MapGrid: React.FC<{ field: [number, number][][] }> = ({ field }) => {
	return (
		<GameMap
			height={field.length}
			width={field[0].length}
			renderCell={(row, col) => {
				const cell = field[row][col];
				const id = `${MAP_PREFIX}${row}:${col}`;
				if (!cell) return <div key={id}>{id}</div>;

				// 드랍 가능영역(빈칸)
				if (cell[0] === -1) {
					return (
						<DroppableCell id={id} key={id}>
							{id}
						</DroppableCell>
					);
				}
				// 길카드(노멀)
				if (cell[0] > 0 && cell[0] < 60) {
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
				}
				// 목표/보상 카드
				if (cell[0] > 60 && cell[0] < 70) {
					return (
						<DroppableCell id={`${GOAL_PREFIX}${row}:${col}`} key={id}>
							<GoalCard
								id={id}
								assetId={cell[0]}
								isHidden={false}
								isDraggable={false}
							/>
						</DroppableCell>
					);
				}
				// 시작카드
				return (
					<Card
						id="start-card"
						assetName="card/start"
						isDraggable={false}
						key={id}
					/>
				);
			}}
		/>
	);
};

import remainCard from "@/assets/card/routeH1.png";
import saboteur from "@/assets/role/saboteur.png";
import worker from "@/assets/role/worker.png";
import roomBackground from "@/assets/room.png";
import trashCan from "@/assets/trash.png";
import ActionCard from "@/components/asset/ActionCard";
import Card from "@/components/asset/Card";
import GoalCard from "@/components/asset/GoalCard";
import RouteCard from "@/components/asset/RouteCard";
import { DroppableCell } from "@/components/game/DroppableCell";
import GameMap from "@/components/game/Map";
import PlayerPanel from "@/components/ui/PlayerPanel";
import Dialog from "@/components/ui/dialog/Dialog";
import GameEndDialog from "@/components/ui/dialog/GameEndDialog";
import RoundEndDialog from "@/components/ui/dialog/RoundEndDialog";
import useGame from "@/hooks/useGame";
import type { FieldState, OpenPlayerState } from "@/models/game/Game";
import type { PlayerState } from "@/models/game/Player";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import {
	useGameData,
	useGameMyInfo,
	useGameRoundReviews,
} from "@/stores/game/GameStore";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// 드래그 앤 드랍 대상 prefix
const PLAYER_PREFIX = "player:";
const MAP_PREFIX = "map:";
const CARD_PREFIX = "card:";
const GOAL_PREFIX = "goal:";
const TRASHBIN = "trashbin";

const GamePage: React.FC = () => {
	const { setImage, setUseLayout } = useBackgroundActions();
	const navigate = useNavigate();
	const room = useRoomInfoStore();
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

	const [cardIdByMapCard, setCardIdByMapCard] = useState<number | null>(null);
	const [twoActionOpen, setTwoActionOpen] = useState<boolean>(false);
	// LEFT, RIGHT, PLAYER
	const [twoActionIds, setTwoActionIds] = useState<
		[number, number, number] | null
	>(null);

	const [isRotated, setIsRotated] = useState<number>(0);
	const rotateInterval = useRef<NodeJS.Timeout | null>(null);
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
						isRotated={isRotated}
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
	}, [activeItem, isRotated]);

	// 드래그 시작: 오버레이와 rotate 애니메이션 설정
	const handleDragStart = (e: DragStartEvent) => {
		const id = e.active.id.toString();
		toast(`드래그 시작: ${id}`);
		setActiveItem(id);
		setIsRotated(0);

		if (id.startsWith(CARD_PREFIX) && !rotateInterval.current) {
			rotateInterval.current = setInterval(
				() => setIsRotated((prev) => (prev + 1) % 2),
				1500,
			);
		}
	};

	// 드래그 종료: 카드 드랍 처리 및 rotate 인터벌 해제
	const handleDragEnd = (e: DragEndEvent) => {
		const overId = e.over?.id.toString();
		const activeId = e.active.id.toString();

		// rotate 반복 종료
		if (rotateInterval.current) {
			clearInterval(rotateInterval.current);
			rotateInterval.current = null;
		}

		if (activeId.startsWith(CARD_PREFIX)) {
			const cardId = Number.parseInt(activeId.split(":")[1]);

			// 내 카드 버리기에 드랍
			if (overId === TRASHBIN && cardId) {
				toast("카드 버리기!");
				dropMyCard(cardId);

				// 맵 셀에 드랍 (길카드/암석낙하카드)
			} else if (overId?.startsWith(MAP_PREFIX)) {
				const [, rowStr, colStr] = overId.split(":");
				const row = Number(rowStr);
				const col = Number(colStr);

				if (cardId > 0 && cardId < 60) usePathCard(cardId, row, col, isRotated);
				else if (cardId === 107) useRockfallCard(cardId, row, col);

				// 골셀에 드랍 (지도카드)
			} else if (overId?.startsWith(GOAL_PREFIX)) {
				const [, rowStr, colStr] = overId.split(":");
				const row = Number(rowStr);
				const col = Number(colStr);

				// 지도카드는 특정 위치만 허용
				if (
					(row === 1 || row === 3 || row === 5) &&
					col === 8 &&
					cardId === 108
				) {
					useMapCard(cardId, row, col).then((cardId) => {
						setCardIdByMapCard(cardId);
						setTimeout(() => {
							setCardIdByMapCard(null);
						}, 3000);
					});
				} else if (cardId !== 108) {
					toast("목적지 카드에는 지도 카드만 사용할 수 있습니다.");
				}

				// 플레이어에 드랍 (수리/부서짐카드)
			} else if (overId?.startsWith(PLAYER_PREFIX)) {
				const playerId = Number.parseInt(overId.slice(PLAYER_PREFIX.length));
				if (cardId > 100 && cardId < 104) {
					// 수리 카드별 대상 부위 매핑
					const states: Record<number, PlayerState> = {
						101: "BROKEN_PICKAXE",
						102: "BROKEN_LANTERN",
						103: "BROKEN_MINECART",
					};
					const targetState = states[cardId];
					if (targetState) useRepairCard(cardId, playerId, targetState);
				} else if (cardId >= 104 && cardId < 107) {
					switch (cardId) {
						case 104:
							setTwoActionIds([102, 103, playerId]);
							break;
						case 105:
							setTwoActionIds([101, 103, playerId]);
							break;
						case 106:
							setTwoActionIds([101, 102, playerId]);
							break;
					}
					setTwoActionOpen(true);
				} else if (cardId >= 109 && cardId <= 111) {
					useBrokenCard(cardId, playerId);
				}
			}
		}

		setActiveItem(null);
	};

	// 라운드 종료 시 다이얼로그 표시
	const endModal = useMemo(() => {
		if (roundReviews.length === 0 || !game) return <></>;
		switch (game.gameState) {
			case "WAITING":
				return <></>;
			case "IN_GAME":
				if (game.round > 0 && roundReviews[game.round - 1]) {
					// 라운드 인덱스 시작 1
					return (
						<RoundEndDialog
							roundReview={roundReviews[game.round - 1]}
							defaultOpen={true}
							onExit={() => {
								if (room.isMaster) startRound();
							}}
						/>
					);
				}
				return <></>;
			case "FINISHED":
				return (
					<GameEndDialog
						roundReviews={roundReviews}
						onExit={() => navigate("/waiting")}
					/>
				);
		}
	}, [roundReviews, game?.round, game?.gameState]);

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
								{id > 0 && id <= 40 && (
									<RouteCard id={`card:${id}:${index}`} assetId={id} />
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
			<Dialog isOpen={cardIdByMapCard !== null} setIsOpen={() => {}}>
				<div className="flex flex-col items-center gap-10">
					<p className="text-red-600 text-xl font-holtwood font-bold">
						3 초동안만 볼 수 있습니다 !
					</p>
					{cardIdByMapCard && (
						<GoalCard
							id={"destId"}
							assetId={cardIdByMapCard}
							isDraggable={false}
							isFlipped={0}
						/>
					)}
				</div>
			</Dialog>
			<Dialog isOpen={twoActionOpen} setIsOpen={setTwoActionOpen}>
				<div className="flex flex-col items-center gap-10">
					<p className="text-red-600 text-xl font-holtwood font-bold">
						둘중 하나를 골라주세요!
					</p>
					<div className="flex items-center gap-10">
						{twoActionIds && (
							<>
								<div
									onClick={() => {
										setTwoActionOpen(false);
										const states: Record<number, PlayerState> = {
											101: "BROKEN_PICKAXE",
											102: "BROKEN_LANTERN",
											103: "BROKEN_MINECART",
										};
										const targetState = states[twoActionIds[0]];
										if (targetState)
											useRepairCard(
												twoActionIds[0],
												twoActionIds[2],
												targetState,
											);
									}}
								>
									<ActionCard id="leftAction" assetId={twoActionIds[0]} />
								</div>
								<div
									onClick={() => {
										setTwoActionOpen(false);
										const states: Record<number, PlayerState> = {
											101: "BROKEN_PICKAXE",
											102: "BROKEN_LANTERN",
											103: "BROKEN_MINECART",
										};
										const targetState = states[twoActionIds[1]];
										if (targetState)
											useRepairCard(
												twoActionIds[1],
												twoActionIds[2],
												targetState,
											);
									}}
								>
									<ActionCard id="rightAction" assetId={twoActionIds[1]} />
								</div>
							</>
						)}
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default GamePage;

/**
 * 맵 렌더링용 별도 컴포넌트 (row, col별 셀 렌더)
 */
const MapGrid: React.FC<{ field: FieldState[][] }> = ({ field }) => {
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
								isDraggable={false}
								isRotated={cell[1]}
								isFlipped={cell[2]}
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
								isDraggable={false}
								isFlipped={cell[2]}
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

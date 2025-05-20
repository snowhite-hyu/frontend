import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import roomBackground from "@/assets/room.png";
import { type ReactNode, useEffect, useState } from "react";
import RouteCard from "@/components/asset/RouteCard";
import GameMap from "@/components/game/Map";
import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	useDroppable,
} from "@dnd-kit/core";
import { toast } from "sonner";
import {
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import update from "immutability-helper";

type CardData = {
	id: string;
	row: number;
	col: number;
	direction: Array<"top" | "right" | "bottom" | "left">;
};
const initialMyCards: CardData[] = [
	{
		id: "mycard-1",
		direction: ["top", "right", "bottom", "left"],
		row: 0,
		col: 0,
	},
	{ id: "mycard-2", direction: ["top", "bottom"], row: 2, col: 1 },
];
const initialCards: CardData[] = [
	{ id: "", direction: ["top", "right", "bottom", "left"], row: 0, col: 0 },
	{ id: "", direction: ["top", "bottom"], row: 2, col: 1 },
];

const TestPage: React.FC = () => {
	const { setImage, setIsVisible, setUseLayout } = useBackgroundActions();
	useEffect(() => {
		setImage(roomBackground);
		setIsVisible(true);
		setUseLayout(false);
	}, []);

	const [myCards, setMyCards] = useState<CardData[]>(initialMyCards);
	const [cards, setCards] = useState<CardData[]>(initialCards);

	const cardAt = (row: number, col: number) => {
		return cards.find((c) => c.row === row && c.col === col);
	};

	const handleDragStart = (e: DragStartEvent) => {
		toast.info(`Drag Start: ${JSON.stringify(e)}`);
	};

	const handleDragOver = (e: DragOverEvent) => {
		toast.info(`Drag Over on ${e.over?.id}`);
	};

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e;
		if (!over) return;

		toast.info(`Active: ${JSON.stringify(active)}`);
		toast.info(`Over: ${JSON.stringify(over)}`);

		if (
			active.id.toString().startsWith("mycard") &&
			over.id.toString().startsWith("cell")
		) {
			const activeIndex = myCards.findIndex((data) => data.id === active.id);

			const [_, rowStr, colStr] = over.id.toString().split("-");
			const row = Number.parseInt(rowStr, 10);
			const col = Number.parseInt(colStr, 10);

			setCards((prev) =>
				update(prev, {
					$push: [
						{
							id: "",
							row: row,
							col: col,
							direction: myCards[activeIndex].direction,
						},
					],
				}),
			);
		}

		if (
			active.id.toString().startsWith("mycard") &&
			over.id.toString().startsWith("mycard")
		) {
			const activeIndex = myCards.findIndex((data) => data.id === active.id);
			const overIndex = myCards.findIndex((data) => data.id === over.id);
			setMyCards((prev) =>
				update(
					update(prev, { $splice: [[activeIndex, 1, myCards[overIndex]]] }),
					{ $splice: [[overIndex, 1, myCards[activeIndex]]] },
				),
			);
		}
	};

	return (
		<div>
			<DndContext
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<GameMap
					width={7}
					height={7}
					renderCell={(row, col) => (
						<DroppableCell id={`cell-${row}-${col}`}>
							{cardAt(row, col) && (
								<RouteCard
									id={`card-${row}-${col}`}
									isBlock={false}
									isHidden={false}
									direction={cardAt(row, col)!.direction}
									isDraggable={false}
								/>
							)}
						</DroppableCell>
					)}
				/>
				<SortableContext
					items={myCards.map((data) => data.id)}
					strategy={horizontalListSortingStrategy}
				>
					<div className="flex gap-2">
						{myCards.map((data) => (
							<RouteCard
								key={data.id}
								id={data.id}
								isBlock={false}
								isHidden={false}
								direction={data.direction}
								isDraggable={true}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};

export default TestPage;

interface DroppableCellProps {
	id: string;
	children: ReactNode;
}

const DroppableCell: React.FC<DroppableCellProps> = ({ id, children }) => {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});
	return (
		<div
			ref={setNodeRef}
			className={`w-full h-full ${isOver ? "bg-[#ccf3ff]" : "bg-white"}`}
		>
			{children}
		</div>
	);
};

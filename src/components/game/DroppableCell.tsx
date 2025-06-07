import { useDroppable } from "@dnd-kit/core";
import { type ReactNode } from "react";

interface DroppableCellProps {
	id: string;
	children: ReactNode;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({
	id,
	children,
}) => {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});
	return (
		<div
			ref={setNodeRef}
			className={`w-full h-full ${isOver ? "bg-[#ccf3ff]" : "bg-white/20"}`}
		>
			{children}
		</div>
	);
};

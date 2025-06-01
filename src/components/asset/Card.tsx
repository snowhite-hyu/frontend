import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const IMAGES: Record<string, string> = import.meta.glob(
	"/src/assets/**/*.png",
	{ eager: true, import: "default" },
);

const getRandomImage: (assetName: string) => string | null = (assetName) => {
	const candidates = Object.entries(IMAGES)
		.filter(([path]) => {
			const file = path.split("/src/assets/")[1]; // "card/routeTRBL1.png"
			return (
				file?.startsWith(assetName) &&
				/^\d+\.png$/.test(file.slice(assetName.length))
			);
		})
		.map(([, url]) => url);

	if (candidates.length === 0) return null;

	return candidates[Math.floor(Math.random() * candidates.length)];
};

export interface CardProps {
	id?: string;
	assetName: string;
	isDraggable?: boolean;
}

const Card: React.FC<CardProps> = ({ id, assetName, isDraggable = true }) => {
	const imgSrc = getRandomImage(assetName);
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useSortable({
			id: id || assetName,
		});

	const img = (
		<img
			src={imgSrc || ""}
			alt={`Cannot Find Source: ${assetName}`}
			className="w-[75px] pointer-events-none cursor-grab"
		/>
	);

	return isDraggable ? (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : 1,
			}}
			{...listeners}
			{...attributes}
		>
			{img}
		</div>
	) : (
		<div>{img}</div>
	);
};

export default Card;

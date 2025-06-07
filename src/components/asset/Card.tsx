import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const IMAGES: Record<string, string> = import.meta.glob(
	"/src/assets/**/*.png",
	{ eager: true, import: "default" },
);
const IMAGE_MAP: Record<string, string> = {};
Object.entries(IMAGES).forEach(([path, url]) => {
	const file = path.split("/src/assets/")[1];
	const m = file?.match(/^(.+?)\.png$/);
	if (!m) return;
	const key = m[1];
	if (!IMAGE_MAP[key]) IMAGE_MAP[key] = "";
	IMAGE_MAP[key] = url;
});

console.log(IMAGE_MAP);

export interface CardProps {
	id?: string;
	assetName: string;
	isDraggable?: boolean;
}

const Card: React.FC<CardProps> = ({ id, assetName, isDraggable = true }) => {
	const imgSrc = IMAGE_MAP[assetName];
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

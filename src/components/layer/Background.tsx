import ageNoticeImage from "@/assets/ageNotice.png";
import bottomBubbleImage from "@/assets/bottomBubble.svg";
import bottomBarImage from "@/assets/bottombar.svg";
import Text from "@/components/ui/text";
import {
	useBackgroundImage,
	useBackgroundIsVisible,
	useBackgroundLayout,
} from "@/stores/common/BackgroundStore";
import type React from "react";
import { type ReactNode, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface BackgroundProps {
	children: ReactNode;
}

const useRefTop: () => [number | null, (node: HTMLElement | null) => void] =
	() => {
		const [top, setTop] = useState<number | null>(null);
		const ref: (node: HTMLElement | null) => void = (node) => {
			if (node !== null) {
				setTop(node.offsetTop);
			}
		};

		return [top, ref];
	};

const Background: React.FC<BackgroundProps> = ({ children }) => {
	const isVisible = useBackgroundIsVisible();
	const image = useBackgroundImage();
	const useLayout = useBackgroundLayout();
	const location = useLocation();
	const basename: string = useMemo(() => {
		const index = location.pathname.lastIndexOf("/");
		if (index >= 0) return location.pathname.substring(index + 1);
		return "HELLO";
	}, [location]);
	const [top, ref] = useRefTop();

	return (
		<div className="min-h-screen bg-gray-900 text-white w-screen h-screen">
			<div className="relative min-h-screen bg-cover bg-no-repeat bg-center w-full h-full">
				<div className="absolute inset-0 bg-[#000232]">
					<img
						src={image}
						className={`${isVisible ? "" : "hidden"} ${useLayout ? "" : "w-screen h-screen object-cover"} h-full object-contain object-left`}
						aria-hidden={true}
					/>
				</div>
				<div className="absolute inset-0 w-full">
					<img
						src={ageNoticeImage}
						className={`${isVisible ? "" : "hidden"} ${useLayout ? "" : "hidden"} w-full h-fit object-contain object-top-right`}
						aria-hidden={true}
					/>
				</div>
				<div className="absolute inset-0 w-full content-end">
					<img
						ref={ref}
						src={bottomBarImage}
						className={`${isVisible ? "" : "hidden"} ${useLayout ? "" : "hidden"} w-full h-fit object-fill object-bottom`}
						aria-hidden={true}
					/>
				</div>
				<div className="absolute w-full h-full items-end justify-center">
					<div
						className="relative flex w-full h-fit items-center justify-center"
						style={{ top: `${top}px` }}
					>
						<img
							className={`${isVisible ? "" : "hidden"} ${useLayout ? "" : "hidden"} absolute`}
							src={bottomBubbleImage}
							aria-hidden={true}
						/>
						<Text
							className={`${isVisible ? "" : "hidden"} ${useLayout ? "" : "hidden"} absolute`}
						>
							{basename}
						</Text>
					</div>
				</div>
				<div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Background;

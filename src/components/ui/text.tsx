import type { HTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextProps {
	className?: HTMLProps<HTMLElement>["className"];
	style?: HTMLProps<HTMLElement>["style"];
	children: ReactNode;
}

const Text: React.FC<TextProps> = ({ children, className, style }) => (
	<p
		className={twMerge(
			"text-2xl sm:text-5xl font-holtwood font-extrabold uppercase text-[#DF1E34] \
			text-shadow-[0_-3.64px_0.73px_#FFFFFFCC,0_2.92px_3.64px_#000000]",
			className,
		)}
		style={style}
	>
		{children}
	</p>
);

export default Text;

import { cn } from "@/lib/utils";
import type { HTMLProps } from "react";

type InputVariants = "plain" | "sabotuer";

function Input({
	variant = "plain",
	className,
	type,
	...props
}: React.ComponentProps<"input"> & { variant?: InputVariants }) {
	let variantClass: HTMLProps<HTMLElement>["className"];
	switch (variant) {
		case "plain":
			variantClass =
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm \
			focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] \
			aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";
			break;
		case "sabotuer":
			variantClass = "bg-white text-black rounded-2xl h-16 w-full";
			break;
	}

	return variant === "sabotuer" ? (
		<div className={variantClass}>
			<input
				type={type}
				data-slot="input"
				className={cn("h-full w-full p-3", className)}
				{...props}
			/>
		</div>
	) : (
		<input
			type={type}
			data-slot="input"
			className={cn(variantClass, className)}
			{...props}
		/>
	);
}

export { Input };

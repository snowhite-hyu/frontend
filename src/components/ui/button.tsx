import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";
import Text from "./text";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
				sabotuer:
					"bg-[#FAEC72] rounded-[50%] shadow-[inset_-7.29px_-7.29px_2.92px_#706628] text-shadow-[0_2.92px_2.92px_#00000080] \
					active:bg-[#FAEC72] active:shadow-[inset_-3.64px_-3.64px_2.92px_#FFFFFF80,inset_0_2.92px_2.19px_#00000080] \
					transition-shadow duration-150",
				saboteurCheck:
					"bg-[#DF1E34] rounded-[21px] shadow-[inset_-3.64px_-3.64px_2.92px_#00000080,inset_0_2.92px_2.19px_#FFFFFF80] text-shadow-[0_2.92px_2.92px_#00000080] \
					active:bg-[#B71A2A] active:shadow-[inset_-3.64px_-3.64px_2.92px_#FFFFFF80,inset_0_2.92px_2.19px_#00000080] \
					transition-shadow duration-150",
				exit: "bg-[#E0E0E0] rounded-[50%] w-[212px] h-[88px] shadow-[inset_-7.29px_-7.29px_2.92px_#747474]",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				fill: "min-w-10",
				custom: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";
	if (variant === "sabotuer" || variant === "exit") {
		props.children = <Text className="m-5">{props.children}</Text>;
	}

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };

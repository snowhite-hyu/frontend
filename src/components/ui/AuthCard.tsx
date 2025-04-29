import { cn } from "@/lib/utils";
import type { HTMLProps, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface AuthCardProps {
	title: string;
	className?: HTMLProps<HTMLElement>["className"];
	wrapClassName?: HTMLProps<HTMLElement>["className"];
	children: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
	title,
	wrapClassName,
	className,
	children,
}) => {
	return (
		<div className={wrapClassName}>
			<Card className={cn("max-w-md w-full mx-auto my-10", className)}>
				<CardHeader>
					<CardTitle className="text-2xl text-center">{title}</CardTitle>
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</div>
	);
};

export default AuthCard;

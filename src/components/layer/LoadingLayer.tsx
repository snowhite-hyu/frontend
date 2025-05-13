import { useIsLoading } from "@/stores/common/LoadingStore";
import { type ReactNode, useEffect } from "react";
import LoadingUI from "../ui/LoadingUI";

interface LoadingLayerProps {
	children: ReactNode;
}

const LoadingLayer: React.FC<LoadingLayerProps> = ({ children }) => {
	const isLoading = useIsLoading();

	useEffect(() => {
		const helathCheckInterval = setInterval(() => {}, 1000);

		return () => clearInterval(helathCheckInterval);
	}, []);

	return (
		<div className="w-full h-full">
			<div className="absolute">{isLoading && <LoadingUI />}</div>
			{children}
		</div>
	);
};

export default LoadingLayer;

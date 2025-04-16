import { useIsLoading } from "@/stores/common/LoadingStore";
import { useEffect, type ReactNode } from "react";
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

	return <div>{isLoading ? <LoadingUI /> : children}</div>;
};

export default LoadingLayer;

import { useIsLoading } from "@/stores/common/LoadingStore";
import type { ReactNode } from "react";
import LoadingUI from "../ui/LoadingUI";

interface LoadingLayerProps {
	children: ReactNode;
}

const LoadingLayer: React.FC<LoadingLayerProps> = ({ children }) => {
	const isLoading = useIsLoading();

	return <div>{isLoading ? <LoadingUI /> : children}</div>;
};

export default LoadingLayer;

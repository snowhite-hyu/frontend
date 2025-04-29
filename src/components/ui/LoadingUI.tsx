import { useIsLoading } from "@/stores/common/LoadingStore";
import type React from "react";
import type { CSSProperties } from "react";
import { SyncLoader } from "react-spinners";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const LoadingUI: React.FC = () => {
	const isLoading = useIsLoading();
	const color = "#fff000";

	return (
		<div className="sweet-loading">
			<p className="text-center">Loading...</p>
			<SyncLoader
				color={color}
				loading={isLoading}
				cssOverride={override}
				size={50}
			/>
		</div>
	);
};

export default LoadingUI;

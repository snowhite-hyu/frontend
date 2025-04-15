import Background from "@/components/common/Background";
import type React from "react";
import LoadingLayer from "./components/layer/LoadingLayer";
import Router from "./routes";

const App: React.FC = () => {
	return (
		<Background>
			<LoadingLayer>
				<Router />
			</LoadingLayer>
		</Background>
	);
};

export default App;

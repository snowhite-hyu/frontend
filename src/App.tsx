import Background from "@/components/common/Background";
import type React from "react";
import LoadingLayer from "./components/layer/LoadingLayer";
import Router from "./routes";
import HealthyLayer from "./components/layer/HealthyLayer";

const App: React.FC = () => {
	return (
		<Background>
			<HealthyLayer>
				<LoadingLayer>
					<Router />
				</LoadingLayer>
			</HealthyLayer>
		</Background>
	);
};

export default App;

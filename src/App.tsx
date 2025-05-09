import type React from "react";
import { Toaster } from "sonner";
import Background from "./components/layer/Background";
import HealthyLayer from "./components/layer/HealthyLayer";
import LoadingLayer from "./components/layer/LoadingLayer";
import Router from "./routes";

const App: React.FC = () => {
	return (
		<Background>
			<HealthyLayer>
				<LoadingLayer>
					<Router />
					<Toaster />
				</LoadingLayer>
			</HealthyLayer>
		</Background>
	);
};

export default App;

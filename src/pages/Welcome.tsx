import Text from "@/components/ui/text";
import { useBackgroundActions } from "@/stores/common/BackgroundStore";
import { useLoadingActions } from "@/stores/common/LoadingStore";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WelcomPage: React.FC = () => {
	const navigate = useNavigate();
	const loadingActions = useLoadingActions();
	const backgroundActions = useBackgroundActions();

	useEffect(() => {
		const waitTimer = setTimeout(() => {
			loadingActions.setIsLoading(false);
			backgroundActions.setIsVisible(true);
			navigate("/main");
		}, 2000);

		return () => clearTimeout(waitTimer);
	}, [navigate, loadingActions, backgroundActions]);

	return (
		<div className="absolute bg-black flex flex-col text-center justify-center-safe w-screen h-screen">
			<Text className="text-3xl">Who do you call</Text>
			<Text className="text-9xl text-yellow-400">Saboteur?</Text>
		</div>
	);
};

export default WelcomPage;

import { useLoadingActions } from "@/stores/common/LoadingStore";
import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WelcomPage: React.FC = () => {
	const navigate = useNavigate();
	const loadingActions = useLoadingActions();
	
	useEffect(() => {
		const waitTimer = setTimeout(() => {
			loadingActions.setIsLoading(false);
			navigate('/login');
			console.log('Timeout');
		}, 2000);

		return () => clearTimeout(waitTimer);
	}, [navigate, loadingActions]);
	
	return (		
		<div>Saboteur Online !!</div>
	);
};

export default WelcomPage;

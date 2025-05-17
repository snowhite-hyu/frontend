import LoginPage from "@/pages/Login";
import MainPage from "@/pages/Main";
import RegisterPage from "@/pages/Register";
import WelcomPage from "@/pages/Welcome";
import WaitingPage from "@/pages/Waiting";
import CreateRoomPage from "@/pages/CreateRoom";
import RoomListPage from "./pages/RoomList";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useBackgroundActions } from "./stores/common/BackgroundStore";


interface MyRoute {
	path: string;
	element: ReactNode;
}

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = useLocation();
	return (
		<AnimatePresence mode="popLayout">
			<motion.div
				key={location.pathname}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="w-full h-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

const Router: React.FC = () => {
	const location = useLocation();
	const routes: MyRoute[] = [
		{ path: "/", element: <WelcomPage /> },
		{ path: "/main", element: <MainPage /> },
		{ path: "/login", element: <LoginPage /> },
		{ path: "/register", element: <RegisterPage /> },
		{ path: "/waiting", element: <WaitingPage /> },
		{ path: "/create-room", element: <CreateRoomPage /> },
		{ path: "/room", element: <RoomListPage />},
	];

	const backgroundActions = useBackgroundActions();
	if (location.pathname !== "/") {
		backgroundActions.setIsVisible(true);
	}

	return (
		<Routes key={location.pathname} location={location}>
			{routes.map((route) => (
				<Route
					key={route.path.split("?")[0]}
					path={route.path}
					element={
						<Suspense fallback={<WelcomPage />}>
							<Layout>{route.element}</Layout>
						</Suspense>
					}
				/>
			))}
		</Routes>
	);
};

export default Router;

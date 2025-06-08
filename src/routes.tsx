import CreateRoomPage from "@/pages/CreateRoom";
import GamePage from "@/pages/Game";
import LoginPage from "@/pages/Login";
import MainPage from "@/pages/Main";
import RegisterPage from "@/pages/Register";
import WaitingPage from "@/pages/Waiting";
import WelcomPage from "@/pages/Welcome";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RoomListPage from "./pages/RoomList";
import { useBackgroundActions } from "./stores/common/BackgroundStore";
import { useSessionToken } from "./stores/common/SessionStore";

interface MyRoute {
	path: string;
	element: ReactNode;
}

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = window.location;
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
		{ path: "/waiting", element: <WaitingPage /> },
		{ path: "/create-room", element: <CreateRoomPage /> },
		{ path: "/room", element: <RoomListPage /> },
		{ path: "/game", element: <GamePage /> },
	];
	const openRoutes: MyRoute[] = [
		{ path: "/main", element: <MainPage /> },
		{ path: "/login", element: <LoginPage /> },
		{ path: "/register", element: <RegisterPage /> },
	];

	const backgroundActions = useBackgroundActions();
	if (location.pathname !== "/") {
		backgroundActions.setIsVisible(true);
	}

	const isLogined = useSessionToken() !== null;
	return (
		<Routes key={location.pathname} location={location}>
			<Route key={"/"} path={"/"} element=<WelcomPage /> />
			{isLogined &&
				routes.map((route) => (
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
			{isLogined ||
				openRoutes.map((route) => (
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
			<Route
				key={"*"}
				path={"*"}
				element={<Navigate to={isLogined ? "/room" : "/main"} />}
			/>
		</Routes>
	);
};

export default Router;

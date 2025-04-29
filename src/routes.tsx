import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import type { ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/Login";
import WelcomPage from "./pages/Welcome";

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
	const routes: MyRoute[] = [
		{ path: "/", element: <WelcomPage /> },
		{ path: "/login", element: <LoginPage /> },
	];

	return (
		<Routes key={location.pathname} location={location}>
			{routes.map((route) => (
				<Route
					key={route.path.split("?")[0]}
					path={route.path}
					element={<Layout>{route.element}</Layout>}
				/>
			))}
		</Routes>
	);
};

export default Router;

import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomPage from "./pages/Welcome";

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<WelcomPage />} />
				<Route path="/login" element={<WelcomPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;

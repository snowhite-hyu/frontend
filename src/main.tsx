import { createRoot } from "react-dom/client";
import "./index.css";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import App from "./App.tsx";

const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	const router = createBrowserRouter(
		createRoutesFromElements(<Route path="*" element={<App />} />),
	);

	root.render(<RouterProvider router={router} />);
}

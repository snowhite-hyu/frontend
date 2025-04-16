import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

const container = document.getElementById("root");
if (container) {
	const root = createRoot(container);
	const router = createBrowserRouter(
		createRoutesFromElements(<Route path="*" element={<App />} />)
	)

	root.render(<RouterProvider router={router} />);
}

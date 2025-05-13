import { Button } from "@/components/ui/button";
import type React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const links: { title: string; link: string }[] = [
		{ title: "login", link: "/login" },
		{ title: "register", link: "/register" },
		{ title: "manual", link: "/manual" },
	];

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<div className="flex flex-col w-fit mt-[10%] ml-auto mr-[10%] space-y-5">
				{links.map((link) => (
					<Button
						key={link.link}
						variant={"sabotuer"}
						className="h-fit"
						onClick={() => navigate(link.link)}
					>
						{link.title}
					</Button>
				))}
			</div>
		</div>
	);
};

export default MainPage;

import { Button } from "@/components/ui/button";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ManualDialog from "@/components/ui/dialog/ManualDialog";

const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const [isManual, setIsManual] = useState(false);
	const links: { title: string; link: string }[] = [
		{ title: "login", link: "/login" },
		{ title: "register", link: "/register" },
		{ title: "manual", link: "" },
	];

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<div className="flex flex-col w-fit mt-[10%] ml-auto mr-[10%] space-y-5">
				{links.map((link) => (
					<Button
						key={link.link}
						variant={"sabotuer"}
						className="h-fit"
						onClick={() =>
							link.title === "manual" ? setIsManual(true) : navigate(link.link)
						}
					>
						{link.title}
					</Button>
				))}
			</div>
			{isManual && <ManualDialog isOpen={isManual} setIsOpen={setIsManual} />}
		</div>
	);
};

export default MainPage;

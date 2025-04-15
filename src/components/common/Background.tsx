import type React from "react";
import type { ReactNode } from "react";

interface BackgroundProps {
	children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="relative min-h-screen bg-cover bg-no-repeat bg-center">
				<div
					className="absolute inset-0 bg-black opacity-50"
					style={{ backgroundImage: `url('img/background.jpg')` }}
				/>
				<div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Background;

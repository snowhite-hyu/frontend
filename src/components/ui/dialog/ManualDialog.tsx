import { useState } from "react";
import Dialog from "@/components/ui/dialog/Dialog";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import manualImage1 from "@/assets/manual/manual1.svg";
import manualImage2 from "@/assets/manual/manual2.svg";
import manualImage3 from "@/assets/manual/manual3.svg";
import manualImage4 from "@/assets/manual/manual4.svg";
import nextIcon from "@/assets/nextIcon.svg";
import prevIcon from "@/assets/prevIcon.svg";

interface ManualDialogProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const ManualDialog: React.FC<ManualDialogProps> = ({ isOpen, setIsOpen }) => {
	const images = [manualImage1, manualImage2, manualImage3, manualImage4];

	const [currentPage, setCurrentPage] = useState(0);
	const currentImages = images.slice(currentPage * 2, currentPage * 2 + 2);

	return (
		<>
			<Dialog isOpen={isOpen} setIsOpen={setIsOpen} size="big">
				<Text className="text-9xl">Manual</Text>
				<div className="relative w-fit mt-5 flex gap-5">
					{currentImages.map((src, index) => (
						<img key={index} src={src} />
					))}
				</div>
				<div className="absolute top-1/2 right-25">
					{currentPage == 0 && (
						<Button
							variant="ghost"
							size="custom"
							className="text-3xl w-12 h-12"
							onClick={() => setCurrentPage(1)}
						>
							<img src={nextIcon} className="w-full h-full object-contain" />
						</Button>
					)}
				</div>
				<div className="absolute top-1/2 left-25">
					{currentPage == 1 && (
						<Button
							variant="ghost"
							size="custom"
							className="text-3xl w-12 h-12"
							onClick={() => setCurrentPage(0)}
						>
							<img src={prevIcon} className="w-full h-full object-contain" />
						</Button>
					)}
				</div>
				<p className="mt-3 text-lg">{currentPage + 1} / 2</p>
			</Dialog>
		</>
	);
};

export default ManualDialog;

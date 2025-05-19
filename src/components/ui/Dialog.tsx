import { type ReactNode } from "react";
import {
	useFloating,
	useDismiss,
	useRole,
	useInteractions,
	useId,
	FloatingOverlay,
	FloatingFocusManager,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";

interface DialogProps {
	size?: "big" | "small";
	children: ReactNode;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const widthMap = {
	big: "w-5xl",
	small: "w-xl",
};

const Dialog: React.FC<DialogProps> = ({
	size = "big",
	children,
	isOpen,
	setIsOpen,
}) => {
	const { refs, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
	});

	const dismiss = useDismiss(context, {
		outsidePressEvent: "mousedown",
	});
	const role = useRole(context);

	const { getFloatingProps } = useInteractions([dismiss, role]);

	const labelId = useId();
	const descriptionId = useId();

	return (
		<>
			{isOpen && (
				<AnimatePresence>
					<FloatingOverlay lockScroll className="grid place-items-center z-10">
						<FloatingFocusManager context={context}>
							<motion.div
								initial={{ scale: 0.96, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.96, opacity: 0 }}
								transition={{ duration: 0.22 }}
								className={`${widthMap[size]} bg-black/70 place-items-center m-4 p-4 rounded-4xl h-[600px] flex flex-col items-center justify-center text-center`}
								ref={refs.setFloating}
								aria-labelledby={labelId}
								aria-describedby={descriptionId}
								{...getFloatingProps()}
							>
								{children}
							</motion.div>
						</FloatingFocusManager>
					</FloatingOverlay>
				</AnimatePresence>
			)}
		</>
	);
};

export default Dialog;

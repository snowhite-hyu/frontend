import type { ReactNode } from 'react';
import { 
  useFloating, 
  useDismiss, 
  useRole, 
  useInteractions, 
  useId, 
  FloatingOverlay, 
  FloatingFocusManager
} from '@floating-ui/react';

interface DialogProps {
  size?: 'big' | 'small';
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const widthMap = {
  big: 'w-5xl',
  small: 'w-xl',
};

const Dialog: React.FC<DialogProps> = ({ size = 'big', children, isOpen, setIsOpen }) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);
  
  const { getFloatingProps } = useInteractions([
    dismiss, 
    role,
  ]);

  const labelId = useId();
  const descriptionId = useId();

  return (
    <>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          className="grid place-items-center z-10"
        >
          <FloatingFocusManager context={context}>
            <div
              className={`${widthMap[size]} bg-black/70 place-items-center m-4 p-4 rounded-4xl h-[600px] flex flex-col items-center text-center`}
              ref={refs.setFloating}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
};

export default Dialog;
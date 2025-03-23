import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  children: React.ReactNode;
  x: number;
  y: number;
  onPositionChange: (x: number, y: number) => void;
  style?: React.CSSProperties;
}

export default function Window({
  title,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  children,
  x,
  y,
  onPositionChange,
  style,
}: WindowProps) {
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const previousSize = useRef({ width: 600, height: 400 });
  const previousPosition = useRef({ x: 100, y: 100 });

  useEffect(() => {
    if (isOpen && !isClosing) {
      setIsVisible(true);
      setIsClosing(false);
      setIsMinimizing(false);
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsVisible(false);
    }, 400);
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsMinimizing(false);
      onMinimize();
    }, 400);
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      // Store the current size and position before maximizing
      previousSize.current = size;
      previousPosition.current = { x, y };
      setSize({ width: window.innerWidth, height: window.innerHeight });
      onPositionChange(0, 0); // Move to top-left corner
    } else {
      // Restore the previous size and position
      setSize(previousSize.current);
      onPositionChange(previousPosition.current.x, previousPosition.current.y);
    }
    onMaximize(); // Toggle the isMaximized state in the parent
  };

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate bounded coordinates
    const newX = Math.max(0, Math.min(d.x, windowWidth - size.width));
    const newY = Math.max(0, Math.min(d.y, windowHeight - size.height));

    // Update parent with new position
    onPositionChange(newX, newY);
  };

  if (!isOpen && !isClosing && !isVisible) return null;

  return (
    <Rnd
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "width 0.3s, height 0.3s, transform 0.3s",
        ...style,
      }}
      size={
        isMaximized
          ? { width: window.innerWidth, height: window.innerHeight }
          : size
      }
      position={isMaximized ? { x: 0, y: 0 } : { x, y }}
      onDragStop={handleDragStop}
      onResize={(_e, _direction, ref, _delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        onPositionChange(position.x, position.y);
      }}
      dragHandleClassName="window-handle"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      bounds="window"
    >
      <div
        ref={windowRef}
        className={clsx(
          "window-container",
          "flex flex-col bg-mac-window backdrop-blur-lg rounded-lg shadow-lg window-transition",
          "border border-mac-border w-full h-full overflow-hidden",
          isClosing ? "genie-exit" : "genie-enter",
          isMinimizing && "window-minimized",
          isMaximized && "window-maximized"
        )}
      >
        <div className="window-handle flex items-center p-2 bg-gray-100 border-b border-mac-border">
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            ></button>
            <button
              onClick={handleMinimize}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            ></button>
            <button
              onClick={handleMaximize}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            ></button>
          </div>
          <span className="flex-1 text-center text-sm font-medium text-gray-700">
            {title}
          </span>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </Rnd>
  );
}

import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { X, Minus, Maximize } from "lucide-react";
import clsx from "clsx";

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  children: React.ReactNode;
}

export default function Window({
  title,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  children,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
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

  useEffect(() => {
    if (isMaximized) {
      previousSize.current = size;
      previousPosition.current = position;
    }
  }, [isMaximized]);

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
      previousSize.current = size;
      previousPosition.current = position;
    }
    onMaximize();
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Prevent dragging out of bounds
    const newX = Math.max(0, Math.min(d.x, windowWidth - size.width));
    const newY = Math.max(0, Math.min(d.y, windowHeight - size.height));

    setPosition({ x: newX, y: newY });
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
      }}
      size={isMaximized ? { width: "100%", height: "100%" } : size}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDragStop={handleDragStop}
      onResize={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosition(position);
      }}
      dragHandleClassName="window-handle"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      bounds="window" // Ensures the window stays within the viewport
    >
      <div
        ref={windowRef}
        className={clsx(
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
            >
              <X size={10} className="text-white" />
            </button>
            <button
              onClick={handleMinimize}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            >
              <Minus size={10} className="text-white" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-4 h-4 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Maximize size={10} className="text-white" />
            </button>
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

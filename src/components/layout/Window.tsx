import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

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
  isDark: boolean;
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
  isDark,
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
    }, 400); // Match this duration with your CSS transition
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
      previousPosition.current = { x, y };
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      onPositionChange(0, 0);
    } else {
      setSize(previousSize.current);
      onPositionChange(previousPosition.current.x, previousPosition.current.y);
    }
    onMaximize();
  };

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Add smooth boundaries with 20px margin
    const newX = Math.max(20, Math.min(d.x, windowWidth - size.width - 20));
    const newY = Math.max(20, Math.min(d.y, windowHeight - size.height - 20));

    onPositionChange(newX, newY);
  };

  if (!isOpen && !isClosing && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            position: "fixed",
            zIndex: style?.zIndex || 1000,
          }}
        >
          <Rnd
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform",
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
                "flex flex-col backdrop-blur-lg rounded-lg shadow-lg window-transition",
                "border w-full h-full overflow-hidden",
                isClosing ? "window-closing" : "window-open",
                isMinimizing && "window-minimized",
                isMaximized && "window-maximized",
                isDark
                  ? "bg-gray-800/90 border-gray-600"
                  : "bg-white/90 border-gray-200"
              )}
            >
              <div
                className={clsx(
                  "window-handle flex items-center p-2 border-b",
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-200"
                )}
              >
                <div className="flex space-x-2">
                  <button
                    onClick={handleClose}
                    className={clsx(
                      "w-4 h-4 flex items-center justify-center rounded-full transition-colors",
                      isDark
                        ? "bg-red-500 hover:bg-red-400"
                        : "bg-red-500 hover:bg-red-600"
                    )}
                  ></button>
                  <button
                    onClick={handleMinimize}
                    className={clsx(
                      "w-4 h-4 flex items-center justify-center rounded-full transition-colors",
                      isDark
                        ? "bg-yellow-500 hover:bg-yellow-400"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    )}
                  ></button>
                  <button
                    onClick={handleMaximize}
                    className={clsx(
                      "w-4 h-4 flex items-center justify-center rounded-full transition-colors",
                      isDark
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-green-500 hover:bg-green-600"
                    )}
                  ></button>
                </div>
                <span
                  className={clsx(
                    "flex-1 text-center text-sm font-medium",
                    isDark ? "text-gray-200" : "text-gray-700"
                  )}
                >
                  {title}
                </span>
              </div>
              <div className="flex-1 overflow-auto p-4">{children}</div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

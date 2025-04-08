// Import necessary dependencies
import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Window component props interface
 */
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

/**
 * Window component for creating resizable and draggable windows
 */
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
  // State for window size and visibility
  const [size, setSize] = useState({ width: 550, height: 350 });
  const [isVisible, setIsVisible] = useState(false);

  // Refs for storing previous window state
  const windowRef = useRef<HTMLDivElement>(null);
  const previousSize = useRef({ width: 550, height: 350 });
  const previousPosition = useRef({ x: 100, y: 100 });

  // State for exit animation type
  const [exitType, setExitType] = useState<"close" | "minimize">("close");

  // Effect to set visibility when window is opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  /**
   * Handle window close action
   */
  const handleClose = () => {
    setExitType("close");
    setIsVisible(false);
  };

  /**
   * Handle window minimize action
   */
  const handleMinimize = () => {
    setExitType("minimize");
    setIsVisible(false);
  };

  /**
   * Handle window maximize/restore action
   */
  const handleMaximize = () => {
    if (!isMaximized) {
      // Store current size and position before maximizing
      previousSize.current = size;
      previousPosition.current = { x, y };
      // Set window size to full screen
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      onPositionChange(0, 0);
    } else {
      // Restore previous size and position
      setSize(previousSize.current);
      onPositionChange(previousPosition.current.x, previousPosition.current.y);
    }
    onMaximize();
  };

  /**
   * Handle window drag stop event
   * Ensures the window stays within the viewport
   */
  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const newX = Math.max(20, Math.min(d.x, windowWidth - size.width - 20));
    const newY = Math.max(20, Math.min(d.y, windowHeight - size.height - 20));
    onPositionChange(newX, newY);
  };

  // Define exit animation variants
  const exitVariants = {
    close: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
    minimize: {
      y: 100,
      scale: 0.8,
      opacity: 0.5,
      filter: "blur(4px)",
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.27, 1.55],
      },
    },
  };

  // Conditional container style for maximized and normal state
  const containerStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: style?.zIndex || 1000,
        originX: 0.5,
        originY: 0.5,
      }
    : {
        position: "absolute" as const,
        zIndex: style?.zIndex || 1000,
      };

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (exitType === "close") onClose();
        if (exitType === "minimize") onMinimize();
      }}
    >
      {isVisible && (
        <motion.div
          style={containerStyle}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={exitVariants[exitType]}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <Rnd
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
            {/* Main window container */}
            <div
              ref={windowRef}
              className={clsx(
                "flex flex-col backdrop-blur-md rounded-md shadow-md",
                "border w-full h-full overflow-hidden",
                isDark
                  ? "bg-gray-800/95 border-gray-600"
                  : "bg-white/95 border-gray-200"
              )}
            >
              {/* Window title bar */}
              <div
                className={clsx(
                  "window-handle flex items-center p-2 border-b",
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-200"
                )}
              >
                {/* Window control buttons */}
                <div className="flex space-x-2 pl-2">
                  <button
                    onClick={handleClose}
                    className={clsx(
                      "w-3 h-3 rounded-full transition-colors",
                      isDark
                        ? "bg-red-500 hover:bg-red-400"
                        : "bg-red-500 hover:bg-red-600"
                    )}
                  />
                  <button
                    onClick={handleMinimize}
                    className={clsx(
                      "w-3 h-3 rounded-full transition-colors",
                      isDark
                        ? "bg-yellow-500 hover:bg-yellow-400"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    )}
                  />
                  <button
                    onClick={handleMaximize}
                    className={clsx(
                      "w-3 h-3 rounded-full transition-colors",
                      isDark
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-green-500 hover:bg-green-600"
                    )}
                  />
                </div>
                {/* Window title */}
                <span
                  className={clsx(
                    "flex-1 text-center text-xs font-medium",
                    isDark ? "text-gray-200" : "text-gray-700"
                  )}
                >
                  {title}
                </span>
              </div>
              {/* Window content */}
              <div className="flex-1 overflow-auto p-2">{children}</div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

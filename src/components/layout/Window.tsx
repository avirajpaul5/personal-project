// Import necessary dependencies
import { useState, useEffect, useRef, useMemo } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import type { DraggableData, DraggableEvent } from "react-draggable";

// Define the props interface for the Window component
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

// Main Window component
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
  const [size, setSize] = useState({ width: 540, height: 360 });
  const [isVisible, setIsVisible] = useState(false);

  // Refs for storing previous size and position
  const windowRef = useRef<HTMLDivElement>(null);
  const previousSize = useRef({ width: 540, height: 360 });
  const previousPosition = useRef({ x: 90, y: 90 });

  // State for exit animation type
  const [exitType, setExitType] = useState<"close" | "minimize">("close");

  // Effect to set visibility when window is opened
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // Handler for closing the window
  const handleClose = () => {
    setExitType("close");
    setIsVisible(false);
  };

  // Handler for minimizing the window
  const handleMinimize = () => {
    setExitType("minimize");
    setIsVisible(false);
  };

  // Fixed maximize handler
  const handleMaximize = () => {
    if (!isMaximized) {
      previousSize.current = size;
      previousPosition.current = { x, y };
      setSize({
        width: window.innerWidth, // Using window.innerWidth instead of document.documentElement.clientWidth
        height: window.innerHeight, // Using window.innerHeight instead of document.documentElement.clientHeight
      });
      onPositionChange(0, 0);
    } else {
      setSize(previousSize.current);
      onPositionChange(previousPosition.current.x, previousPosition.current.y);
    }
    onMaximize();
  };

  // Handler for drag stop event with snap-to-grid (grid size set to 10px)
  const handleDragStop = (_e: DraggableEvent, d: DraggableData) => {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const GRID_SIZE = 10;

    // Snap the position to the nearest GRID_SIZE multiple
    const snappedX = Math.round(d.x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(d.y / GRID_SIZE) * GRID_SIZE;

    // Ensure the window stays fully within viewport bounds
    const newX = Math.max(0, Math.min(snappedX, windowWidth - size.width));
    const newY = Math.max(0, Math.min(snappedY, windowHeight - size.height));

    onPositionChange(newX, newY);
  };

  // Define exit animation variants for close and minimize
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

  // Memoize the container class for clarity
  const containerClass = useMemo(
    () =>
      clsx(
        "flex flex-col backdrop-blur-sm shadow-lg box-border",
        "border w-full h-full overflow-hidden",
        !isMaximized && "rounded-lg", // Remove rounded corners when maximized
        isDark
          ? "bg-gray-800/90 border-gray-600"
          : "bg-white/90 border-gray-200"
      ),
    [isDark, isMaximized]
  );

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (exitType === "close") onClose();
        if (exitType === "minimize") onMinimize();
      }}
    >
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={exitVariants[exitType]}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          style={{
            position: "fixed",
            zIndex: style?.zIndex || 1000,
            // When maximized, force the container to cover the viewport
            top: isMaximized ? 0 : undefined,
            left: isMaximized ? 0 : undefined,
            width: isMaximized ? window.innerWidth : undefined,
            height: isMaximized ? window.innerHeight : undefined,
            originX: isMaximized ? 0 : 0.5,
            originY: isMaximized ? 0 : 0.5,
          }}
        >
          <Rnd
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "width 0.4s ease, height 0.4s ease, transform 0.4s ease",
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
            <div ref={windowRef} className={containerClass}>
              <div
                className={clsx(
                  "window-handle flex items-center p-2 border-b",
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-200"
                )}
              >
                <div className="flex space-x-1">
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
                <span
                  className={clsx(
                    "flex-1 text-center text-sm font-medium",
                    isDark ? "text-gray-200" : "text-gray-700"
                  )}
                >
                  {title}
                </span>
              </div>
              <div className="flex-1 overflow-auto p-3">{children}</div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

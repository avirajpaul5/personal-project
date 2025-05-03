// Import necessary dependencies
import { useRef } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import WindowTitleBar from "./WindowTitleBar";
import { useWindowState } from "../../hooks/useWindowState";
import { useTheme } from "../../contexts/ThemeContext";

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
  onBodyClick?: () => void;
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
  onBodyClick,
}: WindowProps) {
  // Get theme from context
  const { isDark } = useTheme();
  // Reference to the window element
  const windowRef = useRef<HTMLDivElement>(null);

  // Use the window state hook
  const {
    size,
    isVisible,
    exitType,
    exitVariants,
    handleClose: closeWindow,
    handleMinimize: minimizeWindow,
    handleMaximize: maximizeWindow,
    handleDragStop,
    handleResize,
  } = useWindowState(
    { width: 550, height: 350 },
    { x, y },
    isOpen,
    isMaximized,
    onPositionChange
  );

  // Handler functions that call the hook methods with the appropriate callbacks
  const handleClose = () => {
    if (isMaximized) {
      onMaximize();
    }
    closeWindow(onBodyClick);
  };

  const handleMinimize = () => {
    minimizeWindow(onBodyClick);
  };

  const handleMaximize = () => {
    maximizeWindow(onBodyClick, onMaximize);
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
            onResize={handleResize}
            dragHandleClassName="window-handle"
            disableDragging={isMaximized}
            enableResizing={!isMaximized}
            bounds="window"
          >
            {/* Main window container */}
            <div
              ref={windowRef}
              className={clsx(
                "flex flex-col rounded-md shadow-md theme-transition backdrop-blur-md",
                "border w-full h-full overflow-hidden",
                isDark
                  ? "bg-gray-800/95 border-gray-600"
                  : "bg-white/95 border-gray-200"
              )}
              onClick={onBodyClick}
            >
              {/* Window title bar */}
              <WindowTitleBar
                title={title}
                onClose={handleClose}
                onMinimize={handleMinimize}
                onMaximize={handleMaximize}
              />
              {/* Window content */}
              <div className="flex-1 overflow-auto p-2 text-theme">
                {children}
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

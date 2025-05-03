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

  // Navbar height is 28px (h-7 in Tailwind)
  const navbarHeight = 28;

  // Conditional container style for maximized and normal state
  const containerStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: navbarHeight + "px", // Position exactly at navbar bottom
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: `calc(100vh - ${navbarHeight}px)`,
        zIndex: style?.zIndex || 1000,
        originX: 0,
        originY: 0,
        padding: 0,
        margin: 0,
        borderRadius: 0,
        boxSizing: "border-box",
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
          style={{
            ...containerStyle,
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
          }}
          className={isMaximized ? "m-0 p-0" : ""}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={exitVariants[exitType]}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <Rnd
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "stretch",
              transition: "width 0.3s, height 0.3s, transform 0.3s",
              padding: 0,
              margin: 0,
              boxSizing: "border-box",
              ...style,
            }}
            className={isMaximized ? "m-0 p-0" : ""}
            size={
              isMaximized
                ? {
                    width: window.innerWidth,
                    height: window.innerHeight - navbarHeight,
                  }
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
                "flex flex-col theme-transition backdrop-blur-md",
                isMaximized ? "m-0 p-0" : "rounded-md shadow-md",
                "w-full h-full overflow-hidden",
                isMaximized ? "border-0" : "border",
                isDark
                  ? "bg-gray-800/95 border-gray-600"
                  : "bg-white/95 border-gray-200"
              )}
              style={
                isMaximized ? { margin: 0, padding: 0, borderRadius: 0 } : {}
              }
              onClick={onBodyClick}
            >
              {/* Window title bar */}
              <WindowTitleBar
                title={title}
                onClose={handleClose}
                onMinimize={handleMinimize}
                onMaximize={handleMaximize}
                isMaximized={isMaximized}
              />
              {/* Window content */}
              <div
                className={clsx(
                  "flex-1 overflow-auto text-theme",
                  isMaximized ? "p-0" : "p-2"
                )}
              >
                {children}
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

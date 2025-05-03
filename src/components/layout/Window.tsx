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

  // Calculate dimensions for maximized state
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight - navbarHeight;

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
            position: isMaximized ? "fixed" : "absolute",
            top: isMaximized ? navbarHeight : undefined,
            left: isMaximized ? 0 : undefined,
            right: isMaximized ? 0 : undefined,
            bottom: isMaximized ? 0 : undefined,
            width: isMaximized ? "100%" : undefined,
            height: isMaximized ? `calc(100vh - ${navbarHeight}px)` : undefined,
            zIndex: style?.zIndex || 1000,
            margin: 0,
            padding: 0,
          }}
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
              transition: isMaximized
                ? "none"
                : "width 0.3s, height 0.3s, transform 0.3s",
              ...style,
            }}
            size={isMaximized ? { width: maxWidth, height: maxHeight } : size}
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
                isMaximized
                  ? "rounded-none border-0"
                  : "rounded-md shadow-md border",
                "w-full h-full overflow-hidden",
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

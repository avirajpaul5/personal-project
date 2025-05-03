import { motion } from "framer-motion";
import clsx from "clsx";
import { X } from "lucide-react";
import { Window } from "../utils/types";
import { useDockIconAnimation } from "../../hooks/useDockAnimation";
import { MotionValue } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * MinimizedDockIcon component props interface
 */
export interface MinimizedDockIconProps {
  app: Window;
  mouseX: MotionValue<number>;
  isDark: boolean;
  hoveredMinimizedApp: string | null;
  onRestoreApp: (id: string) => void;
  onCloseApp: (id: string) => void;
  setHoveredMinimizedApp: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

/**
 * MinimizedDockIcon component for minimized apps
 */
export default function MinimizedDockIcon({
  app,
  mouseX,
  isDark,
  hoveredMinimizedApp,
  onRestoreApp,
  onCloseApp,
  setHoveredMinimizedApp,
  isMobile = false,
}: MinimizedDockIconProps) {
  // Use the dock icon animation hook with custom ranges for minimized icons
  const { ref, scale, y } = useDockIconAnimation(mouseX);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        y,
        transformOrigin: "bottom center",
      }}
      className="relative group dock-icon"
    >
      <button
        onClick={() => onRestoreApp(app.id)}
        onMouseEnter={() => !isMobile && setHoveredMinimizedApp(app.id)}
        onMouseLeave={() => !isMobile && setHoveredMinimizedApp(null)}
        onTouchStart={() => isMobile && setHoveredMinimizedApp(app.id)}
        onTouchEnd={() => isMobile && setHoveredMinimizedApp(null)}
        className={clsx(
          "relative rounded-lg flex flex-col items-center",
          isMobile ? "p-1 pb-2" : "p-2 pb-3",
          isMobile ? "touch-manipulation" : ""
        )}
      >
        <img
          src={app.icon}
          alt={app.title}
          className={clsx(
            "transform transition-transform duration-200",
            isMobile ? "w-9 h-9" : "w-12 h-12"
          )}
        />
        {/* Close button for hovered minimized app */}
        {hoveredMinimizedApp === app.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseApp(app.id);
            }}
            className={clsx(
              "absolute -right-1 rounded-full flex items-center justify-center p-0.5",
              isMobile ? "-top-2 w-5 h-5" : "-top-1 w-4 h-4",
              "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <X className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
          </button>
        )}
        {/* Tooltip */}
        <div
          className={clsx(
            "absolute left-1/2 -translate-x-1/2",
            isMobile ? "-top-9" : "-top-7",
            // On mobile, show tooltip on tap instead of hover
            isMobile
              ? "opacity-0 active:opacity-100 transition-opacity"
              : "opacity-0 group-hover:opacity-100 transition-opacity",
            "px-2 py-1 text-xs rounded-md whitespace-nowrap",
            "bg-black/80 text-white"
          )}
        >
          {app.title}
          {/* Tooltip arrow */}
          <div
            className={clsx(
              "absolute bottom-0 left-1/2 -translate-x-1/2",
              "w-2 h-2 transform rotate-45 -mb-1",
              "bg-black/80"
            )}
          ></div>
        </div>
      </button>
    </motion.div>
  );
}

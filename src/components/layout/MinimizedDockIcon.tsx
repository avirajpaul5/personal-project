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
        onMouseEnter={() => setHoveredMinimizedApp(app.id)}
        onMouseLeave={() => setHoveredMinimizedApp(null)}
        className={clsx(
          "relative p-2 rounded-lg flex flex-col items-center top-1 pb-3"
        )}
      >
        <img
          src={app.icon}
          alt={app.title}
          className="w-12 h-12 transform transition-transform duration-200"
        />
        {/* Close button for hovered minimized app */}
        {hoveredMinimizedApp === app.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCloseApp(app.id);
            }}
            className={clsx(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center p-0.5",
              "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {/* Tooltip */}
        <div
          className={clsx(
            "absolute -top-7 left-1/2 -translate-x-1/2",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "px-2 py-1 text-xs rounded-md whitespace-nowrap",
            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
          )}
        >
          {app.title}
          {/* Tooltip arrow */}
          <div
            className={clsx(
              "absolute bottom-0 left-1/2 -translate-x-1/2",
              "w-2 h-2 transform rotate-45 -mb-1",
              isDark ? "bg-gray-800" : "bg-gray-100"
            )}
          ></div>
        </div>
      </button>
    </motion.div>
  );
}

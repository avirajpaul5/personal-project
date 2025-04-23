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
      <div className="relative" style={{ height: "100%" }}>
        <button
          onClick={() => onRestoreApp(app.id)}
          onMouseEnter={() => setHoveredMinimizedApp(app.id)}
          onMouseLeave={() => setHoveredMinimizedApp(null)}
          className={clsx(
            "p-2 rounded-lg flex flex-col items-center relative",
            isDark
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          <img
            src={app.icon}
            alt={app.title}
            className="w-8 h-8 opacity-70 transform transition-transform duration-200 hover:scale-105"
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
                isDark
                  ? "bg-red-500 hover:bg-red-400 text-gray-200"
                  : "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </button>
      </div>
    </motion.div>
  );
}

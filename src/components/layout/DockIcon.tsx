import { motion } from "framer-motion";
import clsx from "clsx";
import { Window } from "../utils/types";
import { useDockIconAnimation } from "../../hooks/useDockAnimation";
import { MotionValue } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * DockIcon component props interface
 */
export interface DockIconProps {
  app: Window;
  mouseX: MotionValue<number>;
  isDark: boolean;
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
}

/**
 * DockIcon component for non-minimized apps
 */
export default function DockIcon({
  app,
  mouseX,
  isDark,
  onAppClick,
  onMinimizeApp,
}: DockIconProps) {
  // Use the dock icon animation hook
  const { ref, scale, y } = useDockIconAnimation(mouseX);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        y,
        transformOrigin: "bottom center",
      }}
      className="relative group"
    >
      <button
        onClick={() =>
          app.isOpen ? onMinimizeApp(app.id) : onAppClick(app.id)
        }
        className={clsx(
          "relative p-2 rounded-lg flex flex-col items-center top-1 pb-3"
        )}
      >
        <img
          src={app.icon}
          alt={app.title}
          className="w-9 h-9 transform transition-transform duration-200"
        />
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
      {/* Indicator for open, non-minimized apps */}
      {app.isOpen && !app.isMinimized && (
        <div
          className={clsx(
            "absolute -bottom-1 left-1/2 -translate-x-1/2",
            "w-1 h-1 rounded-full animate-pulse",
            isDark ? "bg-gray-200" : "bg-gray-100"
          )}
        />
      )}
    </motion.div>
  );
}

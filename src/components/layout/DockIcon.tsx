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
  isMobile?: boolean;
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
  isMobile = false,
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
      {/* Indicator for open, non-minimized apps */}
      {app.isOpen && !app.isMinimized && (
        <div
          className={clsx(
            "absolute -bottom-1 left-1/2 -translate-x-1/2",
            "w-1 h-1 rounded-full animate-pulse",
            "bg-white"
          )}
        />
      )}
    </motion.div>
  );
}

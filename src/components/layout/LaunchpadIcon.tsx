import { motion } from "framer-motion";
import clsx from "clsx";
import { useDockIconAnimation } from "../../hooks/useDockAnimation";
import { MotionValue } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * LaunchpadIcon component props interface
 */
interface LaunchpadIconProps {
  mouseX: MotionValue<number>;
  isDark: boolean;
  onClick: () => void;
}

/**
 * LaunchpadIcon component for the Dock
 */
export default function LaunchpadIcon({
  mouseX,
  isDark,
  onClick,
}: LaunchpadIconProps) {
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
        onClick={onClick}
        className={clsx(
          "relative p-2 rounded-lg flex flex-col items-center top-1 pb-3"
        )}
      >
        <img
          src="/assets/launchpad icon.png"
          alt="Launchpad"
          className="w-12 h-12"
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
          Launchpad
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

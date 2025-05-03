import { motion } from "framer-motion";
import clsx from "clsx";
import { useDockIconAnimation } from "../../hooks/useDockAnimation";
import { MotionValue } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useEffect } from "react";

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

  // State to track if we're on a mobile device
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          "relative rounded-lg flex flex-col items-center",
          isMobile ? "p-2" : "p-2 pb-3",
          isMobile ? "touch-manipulation" : ""
        )}
      >
        <img
          src="/assets/launchpad icon.png"
          alt="Launchpad"
          className={clsx(
            "transform transition-transform duration-200",
            isMobile ? "w-12 h-12" : "w-12 h-12"
          )}
        />
        {/* Only show tooltip on non-mobile devices */}
        {!isMobile && (
          <div
            className={clsx(
              "absolute left-1/2 -translate-x-1/2 -top-7",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "px-2 py-1 text-xs rounded-md whitespace-nowrap",
              "bg-black/80 text-white"
            )}
          >
            Launchpad
            {/* Tooltip arrow */}
            <div
              className={clsx(
                "absolute bottom-0 left-1/2 -translate-x-1/2",
                "w-2 h-2 transform rotate-45 -mb-1",
                "bg-black/80"
              )}
            ></div>
          </div>
        )}
      </button>
    </motion.div>
  );
}

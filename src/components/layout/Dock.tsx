// Import necessary dependencies
import { useState } from "react";
import { Window } from "../utils/types";
import clsx from "clsx";
import { motion } from "framer-motion";
import DockIcon from "./DockIcon";
import LaunchpadIcon from "./LaunchpadIcon";
import MinimizedDockIcon, { MinimizedDockIconProps } from "./MinimizedDockIcon";
import { useDockMouseTracking } from "../../hooks/useDockAnimation";
import { useTheme } from "../../contexts/ThemeContext";
import { DockIconProps } from "./DockIcon";

// Define the props for the Dock component
interface DockProps {
  apps: Window[];
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onRestoreApp: (id: string) => void;
  onCloseApp: (id: string) => void;
  onLaunchpadClick: () => void;
}

// Main Dock component
export default function Dock({
  apps,
  onAppClick,
  onMinimizeApp,
  onRestoreApp,
  onCloseApp,
  onLaunchpadClick,
}: DockProps) {
  // Get theme from context
  const { isDark } = useTheme();
  // State for tracking hovered minimized app
  const [hoveredMinimizedApp, setHoveredMinimizedApp] = useState<string | null>(
    null
  );

  // Use the dock mouse tracking hook
  const { mouseX, handleMouseMove, handleMouseLeave } = useDockMouseTracking();

  // Filter minimized apps that should be shown in dock
  const minimizedApps = apps.filter(
    (app) => app.isMinimized && app.showInDock !== false
  );

  return (
    <div className="relative w-full flex justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "fixed bottom-3 left-1/2 -translate-x-1/2",
          "flex items-end backdrop-blur-xxl rounded-xl shadow-md px-3 py-2",
          "transition-colors duration-300",
          isDark
            ? "bg-gray-900/30 border border-gray-700/50"
            : "bg-white/30 border border-gray-300/50"
        )}
      >
        {/* Launchpad Icon */}
        <LaunchpadIcon
          mouseX={mouseX}
          isDark={isDark}
          onClick={onLaunchpadClick}
        />

        {/* Divider after Launchpad */}
        <div
          className={clsx(
            "w-px h-9 mx-3",
            isDark ? "bg-gray-600" : "bg-gray-300"
          )}
        />

        {/* Open Apps Section */}
        <div className="flex items-end space-x-3">
          {apps
            .filter((app) => !app.isMinimized && app.showInDock !== false)
            .map((app) => (
              <DockIcon
                key={app.id}
                app={app}
                mouseX={mouseX}
                isDark={isDark}
                onAppClick={onAppClick}
                onMinimizeApp={onMinimizeApp}
              />
            ))}
        </div>

        {/* Divider */}
        {minimizedApps.length > 0 && (
          <div
            className={clsx(
              "w-px h-9 mx-3",
              isDark ? "bg-gray-600" : "bg-gray-300"
            )}
          />
        )}

        {/* Minimized Apps Section */}
        {minimizedApps.length > 0 && (
          <div className="flex items-end space-x-5">
            {minimizedApps.map((app) => (
              <MinimizedDockIcon
                key={app.id}
                app={app}
                mouseX={mouseX}
                isDark={isDark}
                hoveredMinimizedApp={hoveredMinimizedApp}
                onRestoreApp={onRestoreApp}
                onCloseApp={onCloseApp}
                setHoveredMinimizedApp={setHoveredMinimizedApp}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

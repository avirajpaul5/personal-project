// Import necessary dependencies
import { useState, useEffect } from "react";
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

  // Use the dock mouse tracking hook
  const { mouseX, handleMouseMove, handleMouseLeave } = useDockMouseTracking();

  // Filter minimized apps that should be shown in dock
  const minimizedApps = apps.filter(
    (app) => app.isMinimized && app.showInDock !== false
  );

  // Style for the dock - on mobile, it's just a circular button for Launchpad
  const dockStyle = isMobile
    ? {
        maxWidth: "auto",
        borderRadius: "50%",
        padding: "0.5rem",
      }
    : {
        maxWidth: "auto",
      };

  return (
    <div className="relative w-full flex justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={dockStyle}
        className={clsx(
          "fixed left-1/2 -translate-x-1/2",
          isMobile ? "bottom-1" : "bottom-3",
          "flex items-center justify-center backdrop-blur-xxl rounded-xl shadow-md",
          isMobile ? "p-0" : "px-3 py-2",
          "bg-black/20 border border-white/20"
        )}
      >
        <div className="flex items-center justify-center">
          {/* Launchpad Icon */}
          <LaunchpadIcon
            mouseX={mouseX}
            isDark={isDark}
            onClick={onLaunchpadClick}
          />

          {/* Only show other icons on non-mobile devices */}
          {!isMobile && (
            <>
              {/* Divider after Launchpad */}
              <div className="w-px h-9 mx-3 bg-white/30" />

              {/* Open Apps Section */}
              <div className="flex items-center space-x-3">
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
                      isMobile={isMobile}
                    />
                  ))}
              </div>

              {/* Divider */}
              {minimizedApps.length > 0 && (
                <div className="w-px h-9 mx-3 bg-white/30" />
              )}

              {/* Minimized Apps Section */}
              {minimizedApps.length > 0 && (
                <div className="flex items-center space-x-5">
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
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

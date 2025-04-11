// Import necessary dependencies
import { useState, useRef } from "react";
import { Window } from "../utils/types";
import clsx from "clsx";
import { X } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

// Define the props for the Dock component
interface DockProps {
  apps: Window[];
  isDark: boolean;
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onRestoreApp: (id: string) => void;
  onCloseApp: (id: string) => void;
}

// Main Dock component
export default function Dock({
  apps,
  isDark,
  onAppClick,
  onMinimizeApp,
  onRestoreApp,
  onCloseApp,
}: DockProps) {
  // State for tracking hovered minimized app
  const [hoveredMinimizedApp, setHoveredMinimizedApp] = useState<string | null>(
    null
  );
  // Motion value for mouse X position
  const mouseX = useMotionValue(Infinity);
  // Filter minimized apps
  const minimizedApps = apps.filter((app) => app.isMinimized);

  return (
    <div className="relative w-full flex justify-center">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={clsx(
          "fixed bottom-3 left-1/2 -translate-x-1/2",
          "flex items-end backdrop-blur-xxl rounded-xl shadow-md px-3 py-2",
          "transition-colors duration-300",
          isDark
            ? "bg-gray-900/30 border border-gray-700/50"
            : "bg-white/30 border border-gray-300/50"
        )}
      >
        {/* Open Apps Section */}
        <div className="flex items-end space-x-3">
          {apps
            .filter((app) => !app.isMinimized)
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

// DockIcon component for non-minimized apps
function DockIcon({
  app,
  mouseX,
  isDark,
  onAppClick,
  onMinimizeApp,
}: {
  app: Window;
  mouseX: MotionValue<number>;
  isDark: boolean;
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale based on mouse distance
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.3, 1]);
  const scale = useSpring(scaleSync, {
    mass: 0.2,
    stiffness: 250,
    damping: 12,
  });

  // Y position based on scale
  const ySync = useTransform(scale, [1, 1.3], [0, -8]);
  const y = useSpring(ySync, { stiffness: 300, damping: 12 });

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

// MinimizedDockIcon component for minimized apps
function MinimizedDockIcon({
  app,
  mouseX,
  isDark,
  hoveredMinimizedApp,
  onRestoreApp,
  onCloseApp,
  setHoveredMinimizedApp,
}: {
  app: Window;
  mouseX: MotionValue<number>;
  isDark: boolean;
  hoveredMinimizedApp: string | null;
  onRestoreApp: (id: string) => void;
  onCloseApp: (id: string) => void;
  setHoveredMinimizedApp: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale based on mouse distance
  const scaleSync = useTransform(
    distance,
    [-200, -50, 0, 50, 200],
    [1, 1.2, 1.3, 1.2, 1]
  );
  const scale = useSpring(scaleSync, {
    mass: 0.5,
    stiffness: 300,
    damping: 15,
  });

  // Y position based on scale
  const ySync = useTransform(scale, [1, 1.3], [0, -8]);
  const y = useSpring(ySync, { stiffness: 400, damping: 15 });

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

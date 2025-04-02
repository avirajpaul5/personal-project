import { useState } from "react";
import { Window } from "../utils/types";
import clsx from "clsx";

interface DockProps {
  apps: Window[];
  isDark: boolean;
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onRestoreApp: (id: string) => void;
}

export default function Dock({
  apps,
  isDark,
  onAppClick,
  onMinimizeApp,
  onRestoreApp,
}: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const minimizedApps = apps.filter((app) => app.isMinimized);

  return (
    <div
      className={clsx(
        "fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center backdrop-blur-xl rounded-2xl shadow-lg px-4 py-2 transition-colors duration-300",
        isDark
          ? "bg-gray-900/30 border border-gray-700/50"
          : "bg-white/30 border border-gray-300/50"
      )}
    >
      {/* Open Apps Section */}
      <div className="flex items-center space-x-2">
        {apps
          .filter((app) => !app.isMinimized)
          .map((app) => (
            <div key={app.id} className="relative group">
              <button
                onClick={() =>
                  app.isOpen ? onMinimizeApp(app.id) : onAppClick(app.id)
                }
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className={clsx(
                  "relative transition-all duration-200 ease-in-out p-2 rounded-xl",
                  isDark ? "hover:bg-white/10" : "hover:bg-black/10",
                  hoveredApp === app.id ? "scale-125" : "scale-100"
                )}
              >
                <img src={app.icon} alt={app.title} className="w-10 h-10" />
                <div
                  className={clsx(
                    "absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs rounded-md whitespace-nowrap",
                    isDark
                      ? "bg-gray-800 text-gray-200"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  {app.title}
                  <div
                    className={clsx(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 transform rotate-45 -mb-1",
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    )}
                  ></div>
                </div>
              </button>
              {app.isOpen && !app.isMinimized && (
                <div
                  className={clsx(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                    isDark ? "bg-gray-200" : "bg-gray-600"
                  )}
                />
              )}
            </div>
          ))}
      </div>

      {/* Divider */}
      {minimizedApps.length > 0 && (
        <div
          className={clsx(
            "w-px h-10 mx-4",
            isDark ? "bg-gray-600" : "bg-gray-300"
          )}
        />
      )}

      {/* Minimized Apps Section */}
      {minimizedApps.length > 0 && (
        <div className="flex items-center space-x-2">
          {minimizedApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onRestoreApp(app.id)}
              className={clsx(
                "p-2 rounded-xl transition",
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              )}
            >
              <img
                src={app.icon}
                alt={app.title}
                className="w-10 h-10 opacity-70"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

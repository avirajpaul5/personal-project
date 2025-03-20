import { useState } from "react";
import { Window } from "../types";

interface DockProps {
  apps: Window[];
  onAppClick: (id: string) => void;
  onMinimizeApp: (id: string) => void;
  onRestoreApp: (id: string) => void;
}

export default function Dock({
  apps,
  onAppClick,
  onMinimizeApp,
  onRestoreApp,
}: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const minimizedApps = apps.filter((app) => app.isMinimized);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg px-4 py-2">
      {/* Open Apps Section */}
      <div className="flex items-center space-x-2">
        {apps
          .filter((app) => !app.isMinimized)
          .map((app) => (
            <div key={app.id} className="relative">
              <button
                onClick={() =>
                  app.isOpen ? onMinimizeApp(app.id) : onAppClick(app.id)
                }
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                className={`
            relative transition-all duration-200 ease-in-out p-2 rounded-xl
            hover:bg-white/10
            ${hoveredApp === app.id ? "scale-125" : "scale-100"}
          `}
              >
                <img src={app.icon} alt={app.title} className="w-10 h-10" />
              </button>
              {app.isOpen && !app.isMinimized && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
              )}
            </div>
          ))}
      </div>

      {/* Divider to Separate Open and Minimized Apps */}
      {minimizedApps.length > 0 && (
        <div className="w-px h-10 bg-gray-400 mx-4" />
      )}

      {/* Minimized Apps Section */}
      {minimizedApps.length > 0 && (
        <div className="flex items-center space-x-2">
          {minimizedApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onRestoreApp(app.id)}
              className="p-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
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

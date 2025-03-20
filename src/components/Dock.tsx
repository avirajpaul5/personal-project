import { useState } from "react";
import { Window } from "../types";

interface DockProps {
  apps: Window[];
  onAppClick: (id: string) => void;
}

export default function Dock({ apps, onAppClick }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg">
      <div className="flex items-center space-x-2">
        {apps.map((app) => (
          <div key={app.id} className="relative">
            <button
              onClick={() => onAppClick(app.id)}
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
            {hoveredApp === app.id && (
              <div className="absolute bottom-full mb-2 px-2 py-1 text-sm text-white bg-black/80 rounded-md whitespace-nowrap">
                {app.title}
              </div>
            )}
            {app.isOpen && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

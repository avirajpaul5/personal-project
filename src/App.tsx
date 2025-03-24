import { useState, useEffect } from "react";
import { Window as WindowType } from "./components/utils/types";
import Window from "./components/layout/Window";
import Dock from "./components/layout/Dock";
import Navbar from "./components/layout/Navbar";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import MacOSPreloader from "./components/common/Preloader";
import SpotlightSearch from "./components/common/SpotlightSearch";
import { motion } from "framer-motion";

// You can customize these background images by replacing the URLs
const BACKGROUNDS = {
  light:
    "url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?q=80&w=2000')",
  dark: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000')",
};

const initialApps: WindowType[] = [
  {
    id: "home",
    title: "Home",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTEwIDIwdi02aDR2Nkg2di05aDEydjloLTJ6TTEyIDNoOHY2aC04eiIvPjwvc3ZnPg==",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: () => (
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Portfolio OS</h1>
        <p className="text-xl text-gray-600">
          Click on an app in the dock to explore my portfolio
        </p>
      </div>
    ),
  },
  {
    id: "about",
    title: "About",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJWN2gydjJ6Ii8+PC9zdmc+",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: About,
  },
  {
    id: "projects",
    title: "Projects",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTEwIDRINGMtMS4xIDAtMS45OS45LTEuOTkgMkwyIDE4YzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWOGMwLTEuMS0uOS0yLTItMmgtOGwtMi0yeiIvPjwvc3ZnPg==",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: Projects,
  },
  {
    id: "contact",
    title: "Contact",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTIwIDRINGMtMS4xIDAtMS45OS45LTEuOTkgMkwyIDE4YzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNmMwLTEuMS0uOS0yLTItMnptMCAxNEg0VjhoMTZ2MTB6Ii8+PC9zdmc+",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: Contact,
  },
];

function App() {
  const [apps, setApps] = useState<WindowType[]>(initialApps);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleAppClick = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          // Calculate staggered position based on number of open apps
          const openApps = prevApps.filter((a) => a.isOpen && !a.isMinimized);
          const offset = openApps.length * 30;
          return {
            ...app,
            isOpen: true,
            isMinimized: false,
            x: 100 + offset,
            y: 100 + offset,
            lastActive: Date.now(),
          };
        }
        return app;
      })
    );
  };

  const onMinimizeApp = (id: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, isMinimized: true, isOpen: false } : app
      )
    );
  };

  const onRestoreApp = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === id
          ? {
              ...app,
              isMinimized: false,
              isOpen: true,
              lastActive: Date.now(), // Update activation time
            }
          : app
      )
    );
  };

  const handleClose = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => (app.id === id ? { ...app, isOpen: false } : app))
    );
  };

  const handleMinimize = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, isMinimized: true, isOpen: false } : app
      )
    );
  };

  const handleMaximize = (id: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          // Bring window to front when maximizing
          const isMaximizing = !app.isMaximized;
          return {
            ...app,
            isMaximized: !app.isMaximized,
            lastActive: Date.now(),
            // Store original position/size only when maximizing
            ...(isMaximizing
              ? {
                  x: app.x,
                  y: app.y,
                  width: 600,
                  height: 400,
                }
              : {}),
          };
        }
        return app;
      })
    );
  };

  const handlePositionChange = (id: string, newX: number, newY: number) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === id ? { ...app, x: newX, y: newY } : app
      )
    );
  };

  return (
    <div
      className="h-screen bg-black overflow-hidden"
      style={{
        backgroundImage: isDark ? BACKGROUNDS.dark : BACKGROUNDS.light,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading ? (
        <MacOSPreloader onFinish={() => setLoading(false)} />
      ) : (
        // Fade in the main content for a subtle, classy transition.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
          <SpotlightSearch
            isOpen={isSpotlightOpen}
            onClose={() => setIsSpotlightOpen(false)}
            onAppClick={handleAppClick}
          />
          <div className="relative w-full h-full pt-7">
            {apps
              .filter((app) => app.isOpen && !app.isMinimized) // Only show open and non-minimized apps
              .sort((a, b) => a.lastActive - b.lastActive) // Sort by lastActive (oldest first)
              .map((app) => {
                const AppComponent = app.component;
                return (
                  <Window
                    key={app.id}
                    title={app.title}
                    isOpen={app.isOpen}
                    isMaximized={app.isMaximized}
                    x={app.x}
                    y={app.y}
                    onPositionChange={(newX, newY) =>
                      handlePositionChange(app.id, newX, newY)
                    }
                    onClose={() => handleClose(app.id)}
                    onMinimize={() => handleMinimize(app.id)}
                    onMaximize={() => handleMaximize(app.id)}
                    style={{ zIndex: 1000 + app.lastActive }} // Dynamic z-index based on lastActive
                  >
                    <AppComponent />
                  </Window>
                );
              })}
          </div>
          <Dock
            apps={apps}
            onAppClick={handleAppClick}
            onMinimizeApp={onMinimizeApp}
            onRestoreApp={onRestoreApp}
          />
        </motion.div>
      )}
    </div>
  );
}

export default App;

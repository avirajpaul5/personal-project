import { useState, useEffect } from "react";
import { Window as WindowType } from "./types";
import Window from "./components/Window";
import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import MacOSPreloader from "./components/Preloader";
import { motion } from "framer-motion";

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
    component: Contact,
  },
];

function App() {
  const [apps, setApps] = useState<WindowType[]>(initialApps);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
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
        app.id === id ? { ...app, isMinimized: false, isOpen: true } : app
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
      prevApps.map((app) =>
        app.id === id ? { ...app, isMaximized: !app.isMaximized } : app
      )
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
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
      {loading ? (
        <MacOSPreloader onFinish={() => setLoading(false)} />
      ) : (
        // Fade in the main content for a subtle, classy transition.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />
          <div className="relative w-full h-full pt-7">
            {apps.map((app) => {
              if (!app.isOpen || app.isMinimized) return null;
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

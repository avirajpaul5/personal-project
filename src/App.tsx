// Import necessary dependencies and components
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
import Launchpad from "./components/common/Launchpad";
import Terminal from "./components/sections/Terminal";
import WallpaperSelector from "./components/sections/WallpaperSelector";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Toaster } from "sonner";

// Import custom hooks
import { useWindowManager } from "./hooks/useWindowManager";
import { useTerminal } from "./hooks/useTerminal";
import { useLaunchpad } from "./hooks/useLaunchpad";

// Import ThemeProvider and useTheme hook from our new context
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
// Import SpotlightProvider
import { SpotlightProvider, useSpotlight } from "./contexts/SpotlightContext";

// Define initial state for app windows
const initialApps: WindowType[] = [
  // Home app configuration
  {
    id: "home",
    title: "Home",
    icon: "/assets/home-icon.png", // Updated icon path
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: () => (
      <div className="text-center p-8 dark:text-white">
        <h1 className="text-4xl font-bold mb-4">Portfolio OS</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Click on an app in the dock to explore my portfolio
        </p>
      </div>
    ),
  },
  // About app configuration
  {
    id: "about",
    title: "About",
    icon: "/assets/About Icon.png",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: About,
  },
  // Projects app configuration
  {
    id: "projects",
    title: "Projects",
    icon: "/assets/projects icon.png",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: Projects,
  },
  // Contact app configuration
  {
    id: "contact",
    title: "Contact",
    icon: "/assets/Contact me icon.png",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: Contact,
  },
  // Terminal app configuration
  {
    id: "terminal",
    title: "Terminal",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTIwIDRINGMtMS4xIDAtMS45OS45LTEuOTkgMkwyIDE4YzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNmMwLTEuMS0uOS0yLTItMnptLTIgMTRINnYtMmgxMnYyem0wLTRINnYtMmgxMnYyem0wLTRINlY4aDEydjJ6Ii8+PC9zdmc+",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 100,
    lastActive: 0,
    component: () => null,
  },
  // Wallpaper Selector app configuration
  {
    id: "wallpaper-selector",
    title: "Wallpaper Selector",
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTIxIDNIM2MtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxOGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDNWNWgxOHYxNHptLTEwLTcuNWMwIC44My0uNjcgMS41LTEuNSAxLjVTOCAxMS4zMyA4IDEwLjVTOC42NyA5IDkuNSA5czEuNS42NyAxLjUgMS41ek0xMiAxNGg3djJoLTd2LTJ6Ii8+PC9zdmc+",
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 150,
    y: 150,
    lastActive: 0,
    component: WallpaperSelector,
    showInDock: false, // Hide from dock but keep in Launchpad
  },
];

// Main App component
function AppContent() {
  // State for loading screen
  const [loading, setLoading] = useState(true);

  // Use custom hooks
  const { isDark, currentWallpaper } = useTheme();
  const { isOpen: isSpotlightOpen, closeSpotlight } = useSpotlight();
  const {
    isOpen: isLaunchpadOpen,
    openLaunchpad,
    closeLaunchpad,
    toggleLaunchpad,
  } = useLaunchpad();
  const {
    windows,
    openWindow,
    minimizeWindow,
    minimizeAndCloseWindow,
    restoreWindow,
    closeWindow,
    closeWindowCompletely,
    toggleMaximize,
    updatePosition,
    focusWindow,
  } = useWindowManager(initialApps);
  const { processCommand } = useTerminal(openWindow);

  // Effect hook for initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  // Render the main app component
  return (
    <div
      className={clsx(
        "h-screen overflow-hidden transition-colors duration-300",
        isDark ? "dark" : "light"
      )}
      style={{
        backgroundImage: currentWallpaper,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isDark ? "#111827" : "#ffffff",
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
          <Navbar openWindow={openWindow} />
          <SpotlightSearch
            isOpen={isSpotlightOpen}
            onClose={closeSpotlight}
            onAppClick={openWindow}
          />
          <Launchpad
            isOpen={isLaunchpadOpen}
            onClose={closeLaunchpad}
            apps={windows}
            onAppClick={openWindow}
          />
          <div className="relative w-full h-full pt-7">
            {windows
              .filter((app) => app.isOpen && !app.isMinimized) // Only show open and non-minimized apps
              .sort((a, b) => a.lastActive - b.lastActive) // Sort by lastActive (oldest first)
              .map((app, index) => {
                // Calculate zIndex based on index
                const zIndex = 1000 + index;
                // Special handling for terminal
                if (app.id === "terminal") {
                  return (
                    <Window
                      key={app.id}
                      title={app.title}
                      isOpen={app.isOpen && !app.isMinimized}
                      isMaximized={app.isMaximized}
                      x={app.x}
                      y={app.y}
                      onPositionChange={(newX, newY) =>
                        updatePosition(app.id, newX, newY)
                      }
                      onClose={() => closeWindow(app.id)}
                      onMinimize={() => minimizeWindow(app.id)}
                      onMaximize={() => toggleMaximize(app.id)}
                      onBodyClick={() => focusWindow(app.id)}
                      style={{ zIndex }}
                    >
                      <Terminal onCommand={processCommand} />
                    </Window>
                  );
                }

                // For other apps
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
                      updatePosition(app.id, newX, newY)
                    }
                    onClose={() => closeWindow(app.id)}
                    onMinimize={() => minimizeWindow(app.id)}
                    onMaximize={() => toggleMaximize(app.id)}
                    onBodyClick={() => focusWindow(app.id)}
                    style={{ zIndex }}
                  >
                    <AppComponent />
                  </Window>
                );
              })}
          </div>
          <Dock
            apps={windows}
            onAppClick={openWindow}
            onMinimizeApp={minimizeAndCloseWindow}
            onRestoreApp={restoreWindow}
            onCloseApp={closeWindowCompletely}
            onLaunchpadClick={toggleLaunchpad}
          />
        </motion.div>
      )}
    </div>
  );
}

// Wrapper component that provides the theme context
function App() {
  return (
    <ThemeProvider>
      <SpotlightProvider>
        <AppContent />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            // Prevent duplicate toasts with the same ID
            id: (id) => id,
          }}
        />
      </SpotlightProvider>
    </ThemeProvider>
  );
}

// Export the App component as the default export
export default App;

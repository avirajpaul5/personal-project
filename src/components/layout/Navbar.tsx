import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";
import NotificationCenter from "../notifications/NotificationCenter";
import AppleMenu from "../common/AppleMenu";
import clsx from "clsx";
import { useTheme } from "../../contexts/ThemeContext";
import { Search, Battery, Wifi, LayoutGrid } from "lucide-react";
import { useSpotlight } from "../../contexts/SpotlightContext";
import { useMobileDetection } from "../../hooks/useMobileDetection";

interface NavbarProps {
  openWindow: (id: string) => void;
}

export default function Navbar({ openWindow }: NavbarProps) {
  // Get theme values from context
  const { isDark } = useTheme();
  const { openSpotlight } = useSpotlight();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);

  // Use the shared mobile detection hook
  const isMobile = useMobileDetection();

  // Status menu states for future functionality
  const [isBatteryMenuOpen, setIsBatteryMenuOpen] = useState(false);
  const [isWifiMenuOpen, setIsWifiMenuOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 h-9 flex items-center justify-between px-4 text-sm z-50 app-navbar transition-colors duration-300 backdrop-blur-xl",
        isDark ? "bg-gray-900/30 text-gray-300" : "bg-white/50 text-gray-900"
      )}
      style={{
        willChange: "backdrop-filter, background-color", // Optimize for GPU acceleration
      }}
    >
      <button
        onClick={() => setIsAppleMenuOpen(true)}
        className={clsx(
          "font-semibold hover:bg-opacity-20 px-2 py-0.5 rounded transition-colors -ml-2",
          isDark ? "hover:bg-white" : "hover:bg-black"
        )}
      >
        Aviraj Paul
      </button>
      <div className="flex items-center space-x-4">
        {/* Status Icons - Only show on non-mobile devices */}
        {!isMobile && (
          <div className="flex items-center space-x-2 mr-2">
            <button
              onClick={() => setIsBatteryMenuOpen(true)}
              className={clsx(
                "hover:bg-opacity-20 p-1 rounded transition-colors flex items-center justify-center",
                isDark ? "hover:bg-white" : "hover:bg-black"
              )}
              aria-label="Battery Status"
              title="Battery Status"
            >
              <Battery className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWifiMenuOpen(true)}
              className={clsx(
                "hover:bg-opacity-20 p-1 rounded transition-colors flex items-center justify-center",
                isDark ? "hover:bg-white" : "hover:bg-black"
              )}
              aria-label="WiFi Status"
              title="WiFi Status"
            >
              <Wifi className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsControlCenterOpen(true)}
              className={clsx(
                "hover:bg-opacity-20 p-1 rounded transition-colors flex items-center justify-center",
                isDark ? "hover:bg-white" : "hover:bg-black"
              )}
              aria-label="Control Center"
              title="Control Center"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search and Theme */}
        <button
          onClick={openSpotlight}
          className={clsx(
            "hover:bg-opacity-20 p-1 rounded transition-colors flex items-center justify-center",
            isDark ? "hover:bg-white" : "hover:bg-black"
          )}
          aria-label="Spotlight Search"
          title="Spotlight Search"
        >
          <Search className="w-4 h-4" />
        </button>
        {/* Only show ThemeToggle on non-mobile devices */}
        {!isMobile && <ThemeToggle />}
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className={clsx(
            "hover:bg-opacity-20 px-2 py-0.5 rounded transition-colors",
            isDark ? "hover:bg-white" : "hover:bg-black"
          )}
        >
          {formatDate(currentTime)}
        </button>
      </div>
      {/* Menus */}
      <AppleMenu
        isOpen={isAppleMenuOpen}
        onClose={() => setIsAppleMenuOpen(false)}
        openWindow={openWindow}
      />
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />

      {/* Placeholder for future menu components */}
      {/*
        Future components to add:
        <BatteryMenu isOpen={isBatteryMenuOpen} onClose={() => setIsBatteryMenuOpen(false)} />
        <WifiMenu isOpen={isWifiMenuOpen} onClose={() => setIsWifiMenuOpen(false)} />
        <ControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
      */}
    </div>
  );
}

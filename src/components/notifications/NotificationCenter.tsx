// Import necessary dependencies
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useRef, useEffect } from "react";
import { WeatherWidget, WorldClockWidget } from "../widgets";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../../contexts/ThemeContext";

// Define props interface for NotificationCenter component
interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NotificationCenter component
 * Displays a sliding panel with various widgets and information
 */
export default function NotificationCenter({
  isOpen,
  onClose,
}: NotificationCenterProps) {
  // Reference to the panel element for click outside detection
  const panelRef = useRef<HTMLDivElement>(null);

  // Get the current theme
  const { isDark } = useTheme();

  // Effect to handle clicks outside the notification center
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector(".app-navbar");
      const windows = document.querySelectorAll(".window-container");

      const isPanelClick = panelRef.current?.contains(event.target as Node);
      const isNavbarClick = navbar?.contains(event.target as Node);
      const isWindowClick = Array.from(windows).some((window) =>
        window.contains(event.target as Node)
      );

      // Close the notification center if clicked outside
      if (!isPanelClick && !isNavbarClick && !isWindowClick) {
        onClose();
      }
    };

    // Add event listener when the panel is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Clean up the event listener on component unmount or when panel closes
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Spotify playlist ID for embedded player
  const playlistId = "3rE6ZLp7YXOhSIFSfv4LUM";

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 400 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 200,
        restDelta: 0.1,
      }}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      className={`fixed right-0 top-0 h-screen w-96 backdrop-blur-xl shadow-2xl z-[60] overflow-y-auto transition-colors duration-300 ${
        isDark
          ? "bg-gray-900/80 text-white border-l border-gray-700"
          : "bg-white/90 text-gray-900 border-l border-gray-200"
      }`}
    >
      <div className="pt-7 p-6">
        {/* Header with date and close button */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {format(new Date(), "EEEE, MMMM d")}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Close notification center"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content area with widgets and Spotify embed */}
        <div className="space-y-5">
          <WorldClockWidget />
          <WeatherWidget />
          <div className="mt-6">
            <h3
              className={`font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Music
            </h3>
            <div
              style={{ height: "360px" }}
              className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${
                  isDark ? "1" : "0"
                }`}
                title="Spotify Embed: Recommendation Playlist"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="spotify-playlist"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

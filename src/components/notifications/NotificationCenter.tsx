import { motion } from "framer-motion";
import { format } from "date-fns";
import { useRef, useEffect } from "react";
import { WeatherWidget, WorldClockWidget } from "../common/Widgets";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface NotificationCenterProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector(".app-navbar");
      const windows = document.querySelectorAll(".window-container");

      const isPanelClick = panelRef.current?.contains(event.target as Node);
      const isNavbarClick = navbar?.contains(event.target as Node);
      const isWindowClick = Array.from(windows).some((window) =>
        window.contains(event.target as Node)
      );

      if (!isPanelClick && !isNavbarClick && !isWindowClick) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

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
      className="fixed right-0 top-0 h-screen w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl z-[60] overflow-y-auto"
    >
      <div className="pt-7 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {format(new Date(), "EEEE, MMMM d")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <WorldClockWidget />
          <WeatherWidget />
          <div style={{ height: "360px" }}>
            <iframe
              title="Spotify Embed: Recommendation Playlist"
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

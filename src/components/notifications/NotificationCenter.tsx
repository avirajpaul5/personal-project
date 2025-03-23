import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useRef, useEffect } from "react";
import {
  QuoteWidget,
  WeatherWidget,
  MusicWidget,
  WorldClockWidget,
} from "../common/Widgets";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get all interactive elements that should keep notification center open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 200,
            restDelta: 0.1,
          }}
          className="fixed right-0 top-0 h-screen w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl z-[60] overflow-y-auto"
        >
          <div className="pt-12 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
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
              <MusicWidget />
              <QuoteWidget />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

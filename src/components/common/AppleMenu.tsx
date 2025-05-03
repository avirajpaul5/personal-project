import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  FlaskRound as Flask,
  StickyNote,
  Rocket,
  Lightbulb,
  Image,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useTheme } from "../../contexts/ThemeContext";
import { createPortal } from "react-dom";

interface AppleMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const getMenuItems = (isDark: boolean) => [
  { id: "now-playing", label: "Now Playing in Life", icon: Headphones },
  { id: "dev-lab", label: "Dev Lab", icon: Flask },
  { id: "notes", label: "Notes to Self", icon: StickyNote },
  { id: "shipped", label: "Recently Shipped", icon: Rocket },
  { id: "creative", label: "Restart Creative Flow", icon: Lightbulb },
  { id: "wallpaper", label: "Change Wallpaper", icon: Image },
  {
    id: "theme",
    label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
    icon: isDark ? Sun : Moon,
  },
  { id: "exit", label: "Exit AvirajOS", icon: LogOut },
];

const menuAnimation = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transformOrigin: "top left",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
      ease: "easeOut",
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -10,
    transition: {
      delay: i * 0.02,
      duration: 0.15,
      ease: "easeIn",
    },
  }),
};

interface AppleMenuWithWindowProps extends AppleMenuProps {
  openWindow?: (id: string) => void;
}

export default function AppleMenu({
  isOpen,
  onClose,
  openWindow,
}: AppleMenuWithWindowProps) {
  // Get theme from context
  const { isDark, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to open wallpaper selector
  const handleWallpaperChange = () => {
    if (openWindow) {
      openWindow("wallpaper-selector");
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/5 backdrop-blur-[2px]"
            onClick={onClose}
            style={{ position: "fixed" }}
          />
          <motion.div
            ref={menuRef}
            variants={menuAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className={clsx(
              "fixed top-7 left-4 z-[9999] w-72 rounded-lg shadow-xl overflow-hidden backdrop-blur-xl",
              isDark
                ? "bg-gray-800/90 shadow-black/20"
                : "bg-white/90 shadow-black/10"
            )}
            style={{ position: "fixed" }}
          >
            <div className="p-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={clsx(
                  "px-3 py-2 font-semibold border-b",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}
              >
                AvirajOS
              </motion.div>
              <div className="py-1">
                {getMenuItems(isDark).map((item, index, items) => (
                  <motion.button
                    key={item.id}
                    custom={index}
                    variants={itemAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={() => {
                      if (item.id === "wallpaper") {
                        handleWallpaperChange();
                      } else if (item.id === "theme") {
                        toggleTheme();
                        onClose();
                      }
                    }}
                    whileHover={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={clsx(
                      "w-full px-3 py-2 flex items-center space-x-3 text-left text-sm rounded-md",
                      "transition-colors duration-75",
                      index === items.length - 1 && "mt-1",
                      index === items.length - 1 &&
                        (isDark
                          ? "border-t border-gray-700"
                          : "border-t border-gray-200")
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

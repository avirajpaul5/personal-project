import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  FlaskRound as Flask,
  StickyNote,
  Rocket,
  Lightbulb,
  Bot as Lotus,
  Target,
  Glasses,
  Terminal,
  LogOut,
} from "lucide-react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface AppleMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const menuItems = [
  { id: "now-playing", label: "Now Playing in Life", icon: Headphones },
  { id: "dev-lab", label: "Dev Lab", icon: Flask },
  { id: "notes", label: "Notes to Self", icon: StickyNote },
  { id: "shipped", label: "Recently Shipped", icon: Rocket },
  { id: "creative", label: "Restart Creative Flow", icon: Lightbulb },
  { id: "focus", label: "Focus Mode", icon: Lotus },
  { id: "zen", label: "System Zen", icon: Target },
  { id: "stealth", label: "Stealth Mode", icon: Glasses },
  { id: "terminal", label: "Lock Terminal", icon: Terminal },
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

export default function AppleMenu({ isOpen, onClose, isDark }: AppleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/5 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            ref={menuRef}
            variants={menuAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            className={clsx(
              "fixed top-7 left-4 z-50 w-72 rounded-lg shadow-xl overflow-hidden",
              isDark
                ? "bg-gray-800/90 shadow-black/20"
                : "bg-white/90 shadow-black/10",
              "backdrop-blur-xl"
            )}
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
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    custom={index}
                    variants={itemAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
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
                      index === menuItems.length - 1 && "mt-1",
                      index === menuItems.length - 1 &&
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
    </AnimatePresence>
  );
}

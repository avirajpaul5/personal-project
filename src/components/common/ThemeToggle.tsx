import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  // Get theme from context
  const { isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <MoonIcon className="w-5 h-5 text-yellow-300" />
        ) : (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}

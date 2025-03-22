import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative p-2 rounded-full hover:bg-white/10"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <MoonIcon className="w-4 h-4 text-white" />
        ) : (
          <SunIcon className="w-4 h-4 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}

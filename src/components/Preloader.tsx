import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MacOSPreloaderProps {
  onFinish: () => void;
}

const MacOSPreloader = ({ onFinish }: MacOSPreloaderProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [quip, setQuip] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good morning ☀️");
      setQuip("Seizing the day already? ☕");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good afternoon 🌞");
      setQuip("A productive break, or just some digital wandering? 👀💡");
    } else if (hours >= 17 && hours < 21) {
      setGreeting("Good evening 🌆");
      setQuip("Still in the zone? Keep going. 🚀");
    } else {
      setGreeting("Hello, night owl 🌙");
      setQuip("Burning the midnight oil? 🔥💻");
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            onFinish();
          }, 800);
          return 100;
        }
        return prev + Math.random() * 1.8 + 0.7;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-50"
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Spinner */}
          <motion.div
            className="mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                stroke="#E5E5E5"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                stroke="#007AFF"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="113"
                strokeDashoffset="113"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gray-900 dark:bg-gray-200"
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
          <motion.p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
            {Math.round(progress)}%
          </motion.p>

          {/* Greeting and Quip */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-gray-900 dark:text-white font-medium text-2xl">
              {greeting}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">{quip}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MacOSPreloader;

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
      setGreeting("Good morning");
      setQuip("Early bird gets the worm, eh? 🐦");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good afternoon");
      setQuip("Taking a productive break, I see! ☕");
    } else if (hours >= 17 && hours < 21) {
      setGreeting("Good evening");
      setQuip("Still grinding away? 💻");
    } else {
      setGreeting("Hello night owl");
      setQuip("Coding by moonlight? 🌙");
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            onFinish(); // Notify parent when loading is done
          }, 800);
          return 100;
        }
        return prev + Math.random() * 1.8 + 0.7;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  // (The rest of your animation variants remains unchanged)

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

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
          <motion.div className="mb-12" variants={spinnerVariants} animate="animate">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="2"
                className="dark:opacity-20"
              />
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#007AFF"
                strokeWidth="3"
                strokeLinecap="round"
                className="dark:stroke-blue-500"
                strokeDasharray="113"
                strokeDashoffset="113"
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center"
          >
            <div className="mb-12">
              <div className="w-64 h-1 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gray-900 dark:bg-gray-200"
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              </div>
              <motion.p className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {Math.round(progress)}%
              </motion.p>
            </div>

            <div className="flex flex-col items-center">
              <div className="overflow-hidden mb-1">
                <motion.h1
                  className="text-gray-900 dark:text-white font-medium text-3xl"
                  initial={{ y: 40 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                >
                  {greeting.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>

              <motion.p
                className="text-gray-500 dark:text-gray-400 font-normal text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.8,
                }}
              >
                {quip}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MacOSPreloader;

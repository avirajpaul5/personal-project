import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getTimeBasedGreeting } from "../../utils/greetings";

interface MacOSPreloaderProps {
  onFinish: () => void;
}

const MacOSPreloader = ({ onFinish }: MacOSPreloaderProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageRevealed, setImageRevealed] = useState(false);
  // Use a ref instead of state to track if toast has been shown
  const toastShownRef = useRef(false);

  // Effect to handle progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Only show toast if it hasn't been shown yet using ref
            if (!toastShownRef.current) {
              toastShownRef.current = true;
              // Show toast notification with greeting after loading completes
              const { greeting: timeGreeting, quip: timeQuip } =
                getTimeBasedGreeting();
              // Use a unique ID for the toast to prevent duplicates
              toast(timeGreeting, {
                id: "greeting-toast", // Add a unique ID
                description: timeQuip,
                duration: 5000,
                icon: timeGreeting.includes("morning")
                  ? "☀️"
                  : timeGreeting.includes("afternoon")
                  ? "🌞"
                  : timeGreeting.includes("evening")
                  ? "🌆"
                  : "🌙",
              });
            }
            setLoading(false);
            onFinish();
          }, 800);
          return 100;
        }
        return prev + Math.random() * 1.8 + 0.7;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]); // Remove toastShown from dependencies

  // Separate effect to handle image reveal
  useEffect(() => {
    if (progress >= 30 && !imageRevealed) {
      setImageRevealed(true);
    }
  }, [progress, imageRevealed]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Image Reveal Animation */}
          <div className="relative w-full max-w-lg mb-8">
            <div className="relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between px-4 py-2 text-gray-800 dark:text-gray-200">
                <span className="font-medium">Aviraj Paul</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>

              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1682687982107-14492010e05e?q=80&w=1974&auto=format&fit=crop"
                  alt="Aesthetic background"
                  className="w-full h-full object-cover"
                />

                {/* Overlay that reveals the image */}
                <motion.div
                  className="absolute inset-0 bg-white dark:bg-gray-900 origin-bottom"
                  initial={{ scaleY: 1 }}
                  animate={{
                    scaleY: imageRevealed ? 0 : 1,
                    transition: {
                      duration: 1.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.3,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gray-800 dark:bg-gray-100"
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>

          {/* Loading message */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Loading your experience...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MacOSPreloader;

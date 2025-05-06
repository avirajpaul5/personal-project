import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getTimeBasedGreeting } from "../../utils/greetings";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

interface MacOSPreloaderProps {
  onFinish: () => void;
}

const MacOSPreloader = ({ onFinish }: MacOSPreloaderProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const toastShownRef = useRef(false);

  // Refs for text elements and their masks
  const headerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const nameMaskRef = useRef<HTMLDivElement>(null);
  const percentageMaskRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);

  // Effect to handle initial animation of all elements (name, percentage, and image)
  useEffect(() => {
    if (
      nameRef.current &&
      percentageRef.current &&
      nameMaskRef.current &&
      percentageMaskRef.current &&
      imageOverlayRef.current
    ) {
      // Create a timeline for all animations
      const tl = gsap.timeline();

      // Animate all elements simultaneously from top to bottom
      tl.fromTo(
        [
          nameMaskRef.current,
          percentageMaskRef.current,
          imageOverlayRef.current,
        ],
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 0.8,
          ease: "power3.inOut",
          transformOrigin: "top",
        }
      );
    }
  }, []);

  // Effect to handle progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 1.8 + 0.7;

        if (newProgress >= 100) {
          clearInterval(interval);

          // Animate out all elements together
          if (
            nameMaskRef.current &&
            percentageMaskRef.current &&
            imageOverlayRef.current
          ) {
            const timeline = gsap.timeline({
              onComplete: () => {
                // Show toast notification
                if (!toastShownRef.current) {
                  toastShownRef.current = true;
                  const { greeting: timeGreeting, quip: timeQuip } =
                    getTimeBasedGreeting();
                  toast(timeGreeting, {
                    id: "greeting-toast",
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

                // Set loading to false to trigger the AnimatePresence exit
                // onFinish will be called by AnimatePresence's onExitComplete
                setLoading(false);
              },
            });

            // Animate all elements together from bottom to top (for exit)
            timeline.to(
              [
                nameMaskRef.current,
                percentageMaskRef.current,
                imageOverlayRef.current,
              ],
              {
                scaleY: 1,
                duration: 0.8,
                ease: "power2.inOut",
                transformOrigin: "bottom",
              }
            );
          }

          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  // No additional animation for percentage updates - we'll let it update freely

  return (
    <AnimatePresence
      onExitComplete={() => {
        // Call onFinish after the exit animation is complete
        onFinish();
      }}
    >
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3, // Small delay to ensure animations complete
            },
          }}
        >
          {/* Image Reveal Animation */}
          <div className="relative w-full max-w-lg mb-8">
            <div className="relative overflow-hidden">
              {/* Header */}
              <div
                ref={headerRef}
                className="flex justify-between px-4 py-2 text-gray-800 dark:text-gray-200"
              >
                {/* Name with mask */}
                <div className="relative overflow-hidden">
                  <span ref={nameRef} className="font-medium block">
                    Aviraj Paul
                  </span>
                  <div
                    ref={nameMaskRef}
                    className="absolute inset-0 bg-white dark:bg-gray-900 transform-gpu"
                    style={{ transformOrigin: "top" }}
                  />
                </div>

                {/* Percentage with mask */}
                <div className="relative overflow-hidden">
                  <span ref={percentageRef} className="font-medium block">
                    {Math.round(progress)}
                  </span>
                  <div
                    ref={percentageMaskRef}
                    className="absolute inset-0 bg-white dark:bg-gray-900 transform-gpu"
                    style={{ transformOrigin: "top" }}
                  />
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1682687982107-14492010e05e?q=80&w=1974&auto=format&fit=crop"
                  alt="Aesthetic background"
                  className="w-full h-full object-cover"
                />

                {/* Overlay that reveals the image - synchronized with text animations */}
                <div
                  ref={imageOverlayRef}
                  className="absolute inset-0 bg-white dark:bg-gray-900 transform-gpu"
                  style={{
                    transformOrigin: "top",
                    transform: "scaleY(1)", // Start with the overlay covering the image
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

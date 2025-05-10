import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getTimeBasedGreeting } from "../../utils/greetings";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

// Array of images for the burst animation
const unsplashImages = [
  // Images from public/assets/preLoader directory
  "/assets/preLoader/image1.jpg",
  "/assets/preLoader/image2.jpg",
  "/assets/preLoader/image3.jpg",
  "/assets/preLoader/image4.jpg",
  "/assets/preLoader/image5.jpg",
  "/assets/preLoader/image6.jpg",
  "/assets/preLoader/image7.jpg",
  "/assets/preLoader/image8.jpg",
];

interface PreloaderProps {
  onFinish: () => void;
}

/**
 * Preloader component that displays a loading screen with animations
 * before the main application is shown.
 */
const Preloader = ({ onFinish }: PreloaderProps) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const toastShownRef = useRef(false);

  // Refs for animation elements
  const headerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const nameMaskRef = useRef<HTMLDivElement>(null);
  const percentageMaskRef = useRef<HTMLDivElement>(null);
  const imageOverlayRef = useRef<HTMLDivElement>(null);

  // Refs for image elements
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Function to initialize images
  const initializeImages = () => {
    // Hide all images initially except the first one
    imageRefs.current.forEach((img, i) => {
      if (img) {
        gsap.set(img, { opacity: i === 0 ? 1 : 0 });
      }
    });
  };

  // Function to start the image burst animation
  const startBurst = () => {
    // Create a new timeline for the burst
    const burstTl = gsap.timeline();

    // Set up rapid transitions between images
    const imgElements = imageRefs.current.filter(Boolean) as HTMLImageElement[];

    // First hide all images except the first one (to ensure we start clean)
    imgElements.forEach((img, idx) => {
      gsap.set(img, { opacity: idx === 0 ? 1 : 0 });
    });

    // Calculate exactly how many transitions we need to end on the last image
    const totalTransitions = imgElements.length; // Just one full cycle

    // Set up timeline for sequential image changes - exactly one full cycle
    for (let i = 0; i < totalTransitions; i++) {
      const currentIndex = i % imgElements.length;
      const prevIndex = i === 0 ? 0 : (i - 1) % imgElements.length;

      // Only hide previous if it's not the first transition
      if (i > 0) {
        burstTl.to(
          imgElements[prevIndex],
          { opacity: 0, duration: 0 },
          i * 0.3
        );
      }

      // Show current image
      burstTl.to(
        imgElements[currentIndex],
        { opacity: 1, duration: 0 },
        i * 0.3
      );
    }
  };

  // Function to create reveal timeline
  const createRevealTimeline = () => {
    if (
      !nameMaskRef.current ||
      !percentageMaskRef.current ||
      !imageOverlayRef.current
    ) {
      return null;
    }

    // Create the initial reveal timeline
    const revealTl = gsap.timeline();

    // Animate all elements simultaneously from top to bottom for initial reveal
    revealTl.fromTo(
      [nameMaskRef.current, percentageMaskRef.current, imageOverlayRef.current],
      { scaleY: 1 },
      {
        scaleY: 0,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "top",
        onComplete: () => startBurst(),
      }
    );

    return revealTl;
  };

  // Function to create exit timeline
  const createExitTimeline = (onComplete: () => void) => {
    if (
      !nameMaskRef.current ||
      !percentageMaskRef.current ||
      !imageOverlayRef.current
    ) {
      return null;
    }

    const timeline = gsap.timeline({
      onComplete,
    });

    // Animate all elements together from bottom to top (for exit)
    timeline.to(
      [nameMaskRef.current, percentageMaskRef.current, imageOverlayRef.current],
      {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "bottom",
      }
    );

    return timeline;
  };

  // Effect to handle initial animation and setup the image burst
  useEffect(() => {
    if (
      nameRef.current &&
      percentageRef.current &&
      nameMaskRef.current &&
      percentageMaskRef.current &&
      imageOverlayRef.current &&
      imageRefs.current.length === unsplashImages.length
    ) {
      // Initialize images
      initializeImages();

      // Create and play the reveal timeline
      createRevealTimeline();
    }
  }, []);

  // Effect to handle progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 1.8 + 0.7;

        if (newProgress >= 100) {
          clearInterval(interval);

          // Create and play the exit timeline
          createExitTimeline(() => {
            // Show toast notification with a 3-second delay
            if (!toastShownRef.current) {
              toastShownRef.current = true;

              // Delay the toast by 3 seconds
              setTimeout(() => {
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
              }, 3000); // 3 seconds delay
            }

            // Set loading to false to trigger the AnimatePresence exit
            setLoading(false);
          });

          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

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
          <div className="relative w-full max-w-[250px] mb-8">
            <div className="relative overflow-hidden">
              {/* Header */}
              <div
                ref={headerRef}
                className="flex justify-between px-4 py-2 text-gray-800 dark:text-gray-200"
              >
                {/* Name with mask */}
                <div className="relative overflow-hidden -ml-4">
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
                <div className="relative overflow-hidden -mr-3">
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

              {/* Image Container - Multiple portrait images for burst effect */}
              <div className="relative aspect-[384/520]">
                {/* Stack all images with absolute positioning */}
                {unsplashImages.map((img, index) => (
                  <img
                    key={img}
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    src={img}
                    alt={`Aesthetic background ${index + 1}`}
                    className="w-full h-full object-cover absolute inset-0"
                    style={{
                      opacity: index === 0 ? 1 : 0, // Only show the first image initially
                      zIndex: 10 + index, // Ensure proper stacking
                    }}
                  />
                ))}

                {/* Overlay that reveals the image - synchronized with text animations */}
                <div
                  ref={imageOverlayRef}
                  className="absolute inset-0 bg-white dark:bg-gray-900 transform-gpu z-50 w-[101%] h-full"
                  style={{
                    transformOrigin: "top",
                    transform: "scaleY(1)", // Start with the overlay covering the image
                    right: "-1%", // Shift 1% to the right
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

export default Preloader;

import { useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

/**
 * Custom hook for dock icon animations
 * @param mouseX The mouse X position motion value
 * @param distanceRange The range of distances to transform
 * @param scaleRange The range of scales to transform to
 * @returns Animation properties for the dock icon
 */
export function useDockIconAnimation(
  mouseX: MotionValue<number>,
  distanceRange: number[] = [-150, 0, 150],
  scaleRange: number[] = [1, 1.3, 1]
) {
  const ref = useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale based on mouse distance
  const scaleSync = useTransform(distance, distanceRange, scaleRange);
  const scale = useSpring(scaleSync, {
    mass: 0.2,
    stiffness: 250,
    damping: 12,
  });

  // Y position based on scale
  const ySync = useTransform(scale, [1, 1.3], [0, -8]);
  const y = useSpring(ySync, { stiffness: 300, damping: 12 });

  return { ref, scale, y };
}

/**
 * Custom hook for dock mouse tracking
 * @returns The mouse X position motion value and setter
 */
export function useDockMouseTracking() {
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return { mouseX, handleMouseMove, handleMouseLeave };
}

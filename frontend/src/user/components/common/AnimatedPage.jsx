import { motion, useReducedMotion } from "framer-motion";

/**
 * AnimatedPage - A wrapper component for subtle page enter animations.
 * Wraps page content (excluding Header/Footer) to provide a consistent
 * fade + slight upward slide on mount.
 *
 * Respects prefers-reduced-motion for accessibility.
 */
export default function AnimatedPage({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: { opacity: 1, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  const reducedVariants = {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      className={className}
      initial="initial"
      animate="animate"
      variants={shouldReduceMotion ? reducedVariants : variants}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}

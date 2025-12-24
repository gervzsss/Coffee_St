import { motion, useReducedMotion } from "framer-motion";

/**
 * AdminAnimatedPage - A wrapper component for subtle page enter animations in admin pages.
 * Wraps page content inside AdminLayout to provide a consistent fade + slight upward slide on mount.
 *
 * Respects prefers-reduced-motion for accessibility.
 */
export default function AdminAnimatedPage({ children, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  const reducedVariants = {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={shouldReduceMotion ? reducedVariants : variants}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

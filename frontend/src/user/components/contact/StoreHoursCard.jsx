import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function StoreHoursCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl bg-[#30442B] p-4 text-white shadow-xl ring-1 shadow-[#30442B]/20 ring-white/10 sm:rounded-3xl sm:p-5 lg:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="font-outfit text-lg font-semibold sm:text-xl">Store Hours</h3>
      <ul className="mt-3 space-y-1.5 text-xs text-white/90 sm:mt-4 sm:space-y-2 sm:text-sm">
        <li className="flex justify-between">
          <span>Monday – Friday</span>
          <span>7:00 AM – 8:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Saturday</span>
          <span>8:00 AM – 9:00 PM</span>
        </li>
        <li className="flex justify-between">
          <span>Sunday</span>
          <span>8:00 AM – 7:00 PM</span>
        </li>
      </ul>
    </motion.div>
  );
}

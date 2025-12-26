import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { staggerContainer, staggerItem } from "../../../components/motion/variants";
import journeyImg from "../../../assets/journeyimage.png";

export default function OurStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative -mt-8 overflow-hidden py-12 sm:-mt-10 sm:py-16 lg:-mt-12 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 xl:max-w-7xl">
        <div className="flex min-h-[400px] flex-col gap-8 sm:min-h-[500px] sm:gap-10 lg:min-h-[600px] lg:flex-row lg:gap-12">
          {/* Image Side */}
          <div className="group relative h-[300px] flex-1 sm:h-[350px] lg:h-auto">
            <div className="absolute inset-0 rotate-3 transform rounded-2xl bg-[#30442B] transition-transform duration-300 group-hover:rotate-6 sm:rounded-3xl"></div>
            <img
              src={journeyImg}
              alt="Fresh baked goods"
              className="relative z-10 h-full w-full rounded-2xl object-cover shadow-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 sm:rounded-3xl"
            />
          </div>
          {/* Content Side */}
          <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="flex flex-1 items-center p-4 sm:p-6 lg:p-12">
            <div className="mx-auto max-w-xl">
              <motion.span variants={staggerItem} className="inline-block border-b-2 border-[#967259]/20 pb-2 text-xs font-semibold tracking-[0.3em] text-[#967259] uppercase sm:text-sm">
                Our Journey
              </motion.span>
              <motion.h2
                variants={staggerItem}
                className="font-outfit mt-4 bg-linear-to-r from-[#30442B] via-[#967259] to-[#30442B] bg-clip-text text-2xl font-semibold text-transparent sm:mt-6 sm:text-3xl lg:text-4xl"
              >
                A Story of Passion & Quality
              </motion.h2>
              <motion.div variants={staggerItem} className="mt-6 space-y-4 text-neutral-600 sm:mt-8 sm:space-y-6">
                <p className="w-full text-sm leading-relaxed hyphens-auto backdrop-blur-sm sm:text-base sm:leading-loose lg:text-lg">
                  Coffee St. began with a simple mission: to serve exceptional coffee in a welcoming environment. What started as a small coffee cart in Manila has grown into a beloved destination for
                  coffee enthusiasts and casual drinkers alike.
                </p>
                <p className="w-full text-sm leading-relaxed hyphens-auto backdrop-blur-sm sm:text-base sm:leading-loose lg:text-lg">
                  Our dedication to quality extends beyond the cup. We work directly with farmers, ensuring fair practices and sustainable relationships that benefit everyone in the coffee supply
                  chain.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

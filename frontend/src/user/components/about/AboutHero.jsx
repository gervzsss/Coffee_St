import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "../../../components/motion/variants";
import aboutHeadImg from "../../../assets/aboutus_head.webp";

export default function AboutHero() {
  return (
    <section className="relative isolate pt-24">
      <div className="absolute inset-0">
        <img src={aboutHeadImg} alt="Coffee roasting process" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-[#1a2319]/75 mix-blend-multiply"></div>

      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 text-white sm:gap-10 sm:px-6 sm:py-20 lg:px-10 lg:py-24 xl:max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.span
            className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.35em] text-amber-200 uppercase sm:px-4 sm:text-xs"
            variants={staggerItem}
          >
            Our Story
          </motion.span>
          <motion.h1 className="font-outfit mt-4 text-3xl leading-tight font-semibold sm:mt-6 sm:text-4xl lg:text-5xl xl:text-6xl" variants={staggerItem}>
            Crafting Moments, <br className="hidden sm:block" />
            One Cup at a Time
          </motion.h1>
          <motion.p className="mt-4 max-w-xl text-sm text-white/80 sm:mt-6 sm:text-base lg:text-lg" variants={staggerItem}>
            Since 2015, we've been dedicated to sourcing the finest coffee beans and creating unforgettable experiences for our community.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

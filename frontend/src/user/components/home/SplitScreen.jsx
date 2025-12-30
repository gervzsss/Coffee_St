import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { slideFromLeft, slideFromRight } from "../../../shared/components/motion/variants";
import { useRef } from "react";
import homePastriesImg from "../../../assets/home_pastries.png";

export default function SplitScreen() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="transform pt-10 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className="flex flex-col items-center md:flex-row">
          {/* Left Side - Image */}
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative h-[350px] w-full overflow-hidden rounded-2xl sm:h-[450px] md:w-1/2 md:rounded-none lg:h-[550px] xl:h-[600px]"
          >
            <div className="absolute inset-0 bg-[#30442B]/10"></div>
            <img src={homePastriesImg} alt="Premium Coffee Experience" className="h-full w-full scale-105 transform object-cover transition-transform duration-700 hover:scale-100" />
          </motion.div>

          {/* Right Side - Content */}
          <motion.div variants={slideFromRight} initial="hidden" animate={isInView ? "visible" : "hidden"} className="w-full px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 md:py-0 lg:px-12 xl:px-16">
            <div className="max-w-lg xl:max-w-xl">
              <h2 className="font-playfair mb-4 text-2xl leading-tight font-bold text-[#30442B] sm:mb-5 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl">Crafting Moments of Pure Coffee Delight</h2>
              <p className="mb-5 text-base leading-relaxed text-gray-600 sm:mb-6 sm:text-lg lg:mb-8">
                Experience the artistry of coffee-making at its finest. Each cup tells a story of carefully selected beans, expert roasting, and passionate craftsmanship. Join us in celebrating the
                perfect brew.
              </p>
              <Link
                to="/products"
                className="group inline-flex items-center rounded-full bg-[#30442B] px-5 py-2.5 text-sm text-white transition-colors duration-300 hover:bg-[#405939] sm:px-6 sm:py-3 sm:text-base lg:px-8"
              >
                <span className="mr-2">Explore Our Coffee and Pastries</span>
                <svg className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

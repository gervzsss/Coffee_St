import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import homePastriesImg from '../../../assets/home_pastries.png';

export default function SplitScreen() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="transform pt-10 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col items-center md:flex-row">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative h-[350px] sm:h-[450px] lg:h-[550px] xl:h-[600px] w-full overflow-hidden md:w-1/2 rounded-2xl md:rounded-none"
          >
            <div className="absolute inset-0 bg-[#30442B]/10"></div>
            <img
              src={homePastriesImg}
              alt="Premium Coffee Experience"
              className="h-full w-full scale-105 transform object-cover transition-transform duration-700 hover:scale-100"
            />
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-0 md:w-1/2"
          >
            <div className="max-w-lg xl:max-w-xl">
              <h2 className="font-playfair mb-4 sm:mb-5 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight font-bold text-[#30442B]">
                Crafting Moments of Pure Coffee Delight
              </h2>
              <p className="mb-5 sm:mb-6 lg:mb-8 text-base sm:text-lg leading-relaxed text-gray-600">
                Experience the artistry of coffee-making at its finest. Each cup
                tells a story of carefully selected beans, expert roasting, and
                passionate craftsmanship. Join us in celebrating the perfect
                brew.
              </p>
              <Link
                to="/products"
                className="group inline-flex items-center rounded-full bg-[#30442B] px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-colors duration-300 hover:bg-[#405939]"
              >
                <span className="mr-2">Explore Our Coffee and Pastries</span>
                <svg
                  className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

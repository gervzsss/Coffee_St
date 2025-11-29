import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import homePastriesImg from '../../../assets/home_pastries.png';

export default function SplitScreen() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="transform pt-16 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center md:flex-row">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative h-[600px] w-full overflow-hidden md:w-1/2"
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
            className="w-full px-8 py-12 md:w-1/2 md:py-0 lg:px-16"
          >
            <div className="max-w-lg">
              <h2 className="font-playfair mb-6 text-4xl leading-tight font-bold text-[#30442B] lg:text-5xl">
                Crafting Moments of Pure Coffee Delight
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                Experience the artistry of coffee-making at its finest. Each cup
                tells a story of carefully selected beans, expert roasting, and
                passionate craftsmanship. Join us in celebrating the perfect
                brew.
              </p>
              <Link
                to="/products"
                className="group inline-flex items-center rounded-full bg-[#30442B] px-8 py-3 text-white transition-colors duration-300 hover:bg-[#405939]"
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

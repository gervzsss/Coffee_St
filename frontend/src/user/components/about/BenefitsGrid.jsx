import { Link } from "react-router-dom";
import { motion, useInView } from "motion/react";
import { staggerContainer, staggerItem } from "../../../components/motion/variants";
import { useRef } from "react";

export default function BenefitsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = [
    {
      id: 1,
      title: "Freshly Roasted Coffee",
      description: "Our beans are roasted in small batches daily to ensure peak flavor and aroma.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c0 1.657-1.343 3-3 3S6 9.657 6 8s1.343-3 3-3 3 1.343 3 3z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Handcrafted Pastries",
      description: "Each pastry is lovingly crafted by our expert bakers using traditional recipes.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4"></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Ethically Sourced",
      description: "We partner directly with farmers to ensure fair prices and sustainable practices.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: "Baked Daily",
      description: "Fresh batches of pastries are baked throughout the day for maximum freshness.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      id: 5,
      title: "Community Focus",
      description: "We're proud to be a gathering place for our local community since 2020.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 009.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: 6,
      title: "Expert Baristas",
      description: "Our certified baristas are passionate about crafting the perfect cup for you.",
      icon: (
        <svg className="mx-auto h-12 w-12 text-[#967259] sm:h-14 sm:w-14 lg:h-16 lg:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section ref={ref} className="bg-[#FDFBF6] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <motion.div className="mb-8 text-center sm:mb-10 lg:mb-12" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6 }}>
          <h2 className="mb-3 text-2xl font-bold text-[#30442B] sm:mb-4 sm:text-3xl lg:text-4xl">Why Choose Our Coffee Shop?</h2>
          <Link to="/about#why-choose-us" className="group inline-flex items-center gap-2 text-[#30442B] transition-colors hover:text-[#967259]">
            <span className="text-sm sm:text-base lg:text-lg">Learn more about us</span>
            <svg className="h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={staggerItem}
              className="benefit-card transform rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg sm:rounded-2xl sm:p-5 lg:p-6"
            >
              <div className="icon-container mb-3 text-center sm:mb-4">{benefit.icon}</div>
              <h3 className="mb-1.5 text-center text-lg font-semibold text-[#30442B] sm:mb-2 sm:text-xl">{benefit.title}</h3>
              <p className="text-center text-sm text-gray-600 sm:text-base">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

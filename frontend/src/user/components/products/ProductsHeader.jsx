import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../../components/motion/variants";

export default function ProductsHeader({ searchQuery, onSearchChange }) {
  return (
    <motion.div className="w-full bg-[#30442B] pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-12 lg:pb-10" variants={staggerContainer} initial="hidden" animate="visible">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <motion.div variants={staggerItem}>
            <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl xl:text-4xl">Discover Our Menu</h1>
            <p className="mt-1 text-sm text-gray-200 sm:mt-2 sm:text-base lg:text-lg">Find something that suits your taste</p>
          </motion.div>
          {/* Search Input */}
          <motion.div className="relative w-full sm:w-72 md:w-80 lg:w-96 xl:w-[420px] 2xl:w-[480px]" variants={staggerItem}>
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-white/50 focus:outline-none sm:py-3 sm:pl-12 sm:text-base lg:py-3.5"
              placeholder="Search our menu..."
            />
            <svg className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-white/70 sm:left-4 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

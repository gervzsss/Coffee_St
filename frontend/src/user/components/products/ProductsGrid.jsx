import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { staggerContainer, staggerItem } from "../../../shared/components/motion/variants";

export default function ProductsGrid({ products, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" style={{ gridAutoRows: "1fr" }}>
        {[...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-100 px-6 py-4 text-red-700">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
        <button onClick={onRetry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30442B]/30 bg-white/70 py-20 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="text-xl font-semibold text-[#30442B]" variants={staggerItem}>
          Products coming soon.
        </motion.p>
        <motion.p className="mt-2 text-sm text-neutral-500" variants={staggerItem}>
          Please check back later while we brew something special.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={products.map((p) => p.id).join("-")}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={staggerItem} custom={index}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

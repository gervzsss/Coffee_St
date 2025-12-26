import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../../components/motion/variants";

const CategoryButton = ({ category, isAllProducts = false, selectedCategory, onCategoryChange }) => (
  <button
    onClick={() => onCategoryChange(category.value)}
    className={`group flex w-full cursor-pointer items-center px-6 ${
      isAllProducts ? "py-5" : "py-4"
    } rounded-xl text-gray-700 transition-all duration-300 hover:bg-[#30442B]/5 hover:text-[#30442B] ${selectedCategory === category.value ? "bg-[#30442B]/5" : ""}`}
  >
    <span className="category-label flex items-center gap-4">
      <span className="category-icon text-xl">{category.icon}</span>
      <span className="category-text font-medium">{category.label}</span>
    </span>
  </button>
);

export default function CategorySidebar({ categories, selectedCategory, onCategoryChange }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCategoryChange = useCallback(
    (value) => {
      onCategoryChange(value);
    },
    [onCategoryChange],
  );

  useEffect(() => {
    if (selectedCategory !== undefined) {
      setIsMobileOpen(false);
    }
  }, [selectedCategory]);

  const drinkCategories = categories.filter((c) => c.section === "drinks");
  const pastryCategories = categories.filter((c) => c.section === "pastries");

  return (
    <motion.div className="lg:sticky lg:top-28 lg:w-80 lg:shrink-0 lg:self-start xl:w-96 2xl:w-[420px]" variants={fadeIn} initial="hidden" animate="visible">
      {/* Mobile Toggle Button */}
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed right-4 bottom-4 z-40 rounded-full bg-[#30442B] p-4 text-white shadow-lg transition-colors hover:bg-[#405939] lg:hidden">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && <div className="bg-opacity-50 fixed inset-0 z-30 bg-black lg:hidden" onClick={() => setIsMobileOpen(false)} />}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 z-40 h-screen w-full transform rounded-none border border-gray-100 bg-white p-4 shadow-xl transition-transform duration-300 sm:p-5 lg:static lg:top-auto lg:left-auto lg:z-10 lg:h-auto lg:max-h-[calc(100vh-140px)] lg:w-full lg:transform-none lg:overflow-y-auto lg:rounded-xl lg:p-6 xl:rounded-2xl xl:p-7 ${
          isMobileOpen ? "translate-x-0 overflow-y-auto" : "-translate-x-full lg:translate-x-0"
        } `}
      >
        <div>
          {/* Mobile Header */}
          <div className="mb-4 flex items-center justify-between border-b pb-4 lg:hidden">
            <h2 className="text-xl font-bold text-[#30442B]">Categories</h2>
            <button onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-gray-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drinks Section */}
          <div className="mb-8 space-y-6">
            {/* All Products - Above Drinks Header */}
            <div className="mb-4">
              <CategoryButton category={{ value: "", label: "All Products", icon: "🌟" }} isAllProducts={true} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
            </div>

            {/* Drinks Header */}
            <h3 className="mb-3 px-2 text-2xl font-bold text-[#30442B] sm:mb-4 sm:text-3xl lg:text-3xl xl:text-4xl">Drinks</h3>

            {/* Drinks Categories */}
            <div className="space-y-3">
              {drinkCategories.map((category) => (
                <CategoryButton key={category.value} category={category} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-gray-200"></div>

          {/* Pastries Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="mb-3 px-2 text-xl font-bold text-[#30442B] sm:mb-4 sm:text-2xl lg:text-2xl xl:text-3xl">Pastries & Desserts</h3>
            <div className="space-y-3">
              {pastryCategories.map((category) => (
                <CategoryButton key={category.value} category={category} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}

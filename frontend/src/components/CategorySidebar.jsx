import { useState, useEffect } from 'react';

export default function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  productCounts = {},
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when category changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [selectedCategory]);

  // Group categories by section
  const drinkCategories = categories.filter((c) => c.section === 'drinks');
  const pastryCategories = categories.filter((c) => c.section === 'pastries');

  const CategoryButton = ({ category, count, isAllProducts = false }) => (
    <button
      onClick={() => onCategoryChange(category.value)}
      className={`cursor-pointer group w-full flex items-center px-6 ${
        isAllProducts ? 'py-5' : 'py-4'
      } rounded-xl transition-all duration-300 hover:bg-[#30442B]/5 text-gray-700 hover:text-[#30442B] ${
        selectedCategory === category.value ? 'bg-[#30442B]/5' : ''
      }`}
    >
      <span className="flex items-center gap-4 category-label">
        <span className="category-icon text-xl">{category.icon}</span>
        <span className="category-text font-medium">{category.label}</span>
      </span>
    </button>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-[#30442B] text-white p-4 rounded-full shadow-lg hover:bg-[#405939] transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed lg:sticky lg:top-28
          w-full lg:w-80 xl:w-96
          h-screen lg:h-auto
          bg-white
          rounded-none lg:rounded-xl
          shadow-xl
          p-6
          z-40 lg:z-0
          transform lg:transform-none
          transition-transform duration-300
          overflow-y-auto
          border border-gray-100
          lg:max-h-[calc(100vh-140px)]
          lg:overflow-y-auto
          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        <div>
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-xl font-bold text-[#30442B]">Categories</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Drinks Section */}
          <div className="space-y-6 mb-8">
            {/* All Products - Above Drinks Header */}
            <div className="mb-4">
              <CategoryButton
                category={{ value: '', label: 'All Products', icon: '🌟' }}
                isAllProducts={true}
              />
            </div>

            {/* Drinks Header */}
            <h3 className="text-[#30442B] font-bold text-3xl px-2 mb-4">
              Drinks
            </h3>

            {/* Drinks Categories */}
            <div className="space-y-3">
              {drinkCategories.map((category) => (
                <CategoryButton
                  key={category.value}
                  category={category}
                  count={productCounts[category.value]}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-6"></div>

          {/* Pastries Section */}
          <div className="space-y-4">
            <h3 className="text-[#30442B] font-bold text-2xl px-2 mb-4">
              Pastries & Desserts
            </h3>
            <div className="space-y-3">
              {pastryCategories.map((category) => (
                <CategoryButton
                  key={category.value}
                  category={category}
                  count={productCounts[category.value]}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

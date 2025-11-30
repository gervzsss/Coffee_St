export default function ProductsHeader({ searchQuery, onSearchChange }) {
  return (
    <div className="w-full bg-[#30442B] pb-6 sm:pb-8 lg:pb-10 pt-8 sm:pt-10 lg:pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
              Discover Our Menu
            </h1>
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
              Find something that suits your taste
            </p>
          </div>
          {/* Search Input */}
          <div className="relative w-full sm:w-72 md:w-80 lg:w-96 xl:w-[420px] 2xl:w-[480px]">
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-3.5 bg-white/10 border border-white/20 rounded-xl text-sm sm:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
              placeholder="Search our menu..."
            />
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

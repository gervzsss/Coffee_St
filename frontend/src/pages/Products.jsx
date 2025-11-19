import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../api/axios';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';

// Category mapping (from old PHP code)
const CATEGORIES = [
  { value: 'hot-coffee', label: 'Hot Coffee', icon: '☕', section: 'drinks' },
  { value: 'iced-coffee', label: 'Iced Coffee', icon: '🧊', section: 'drinks' },
  { value: 'frappe', label: 'Frappe', icon: '🥤', section: 'drinks' },
  { value: 'non-coffee', label: 'Non-Coffee', icon: '🍵', section: 'drinks' },
  { value: 'pastries', label: 'Pastries', icon: '🥐', section: 'pastries' },
  { value: 'cakes', label: 'Cakes', icon: '🍰', section: 'pastries' },
  { value: 'buns', label: 'Buns', icon: '🥖', section: 'pastries' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productCounts, setProductCounts] = useState({});

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search or category changes
  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
      
      // Calculate product counts per category
      const counts = response.data.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      setProductCounts(counts);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Header Section with Search */}
        <div className="w-full bg-[#30442B] py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Discover Our Menu
                </h1>
                <p className="text-gray-200 text-sm md:text-base">
                  Find something that suits your taste
                </p>
              </div>
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Search our menu..."
                />
                <svg
                  className="w-6 h-6 text-white/70 absolute left-4 top-1/2 transform -translate-y-1/2"
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

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <CategorySidebar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              productCounts={productCounts}
            />

            {/* Products Grid */}
            <main className="flex-1">
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#30442B]"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                  <p className="font-semibold">Error</p>
                  <p>{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30442B]/30 bg-white/70 py-20 text-center">
                  <p className="text-xl font-semibold text-[#30442B]">
                    Products coming soon.
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Please check back later while we brew something special.
                  </p>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && filteredProducts.length > 0 && (
                <>
                  <div className="mb-4 text-gray-600">
                    Showing {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

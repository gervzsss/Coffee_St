import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../api/axios';
import CategorySidebar from '../components/CategorySidebar';
import ProductsHeader from '../components/ProductsHeader';
import ProductsGrid from '../components/ProductsGrid';

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

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Header Section with Search */}
        <ProductsHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

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
              <ProductsGrid
                products={filteredProducts}
                loading={loading}
                error={error}
                onRetry={fetchProducts}
              />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

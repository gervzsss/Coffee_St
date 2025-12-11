import { useState, useEffect } from "react";
import { Header, Footer } from "../components/layout";
import { CategorySidebar, ProductsHeader, ProductsGrid } from "../components/products";
import { useProducts } from "../hooks/useProducts";
import { filterProducts } from "../utils/filterProducts";
import { CATEGORIES } from "../constants/categories";

export default function Products() {
  const { products, loading, error, productCounts, refetch } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const filtered = filterProducts(products, searchQuery, selectedCategory);
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header Section with Search */}
        <ProductsHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <CategorySidebar categories={CATEGORIES} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} productCounts={productCounts} />

            {/* Products Grid */}
            <main className="flex-1">
              <ProductsGrid products={filteredProducts} loading={loading} error={error} onRetry={refetch} />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

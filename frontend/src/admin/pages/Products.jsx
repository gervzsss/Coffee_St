import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { getAllProducts, deleteProduct } from '../services/productService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    const matchesAvailability =
      !filterAvailability ||
      (filterAvailability === 'available' && product.is_available) ||
      (filterAvailability === 'not-available' && !product.is_available);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const activeProducts = products.filter((p) => p.is_available).length;
  const archivedProducts = 0; // Placeholder
  const availableProducts = products.filter((p) => p.is_available).length;
  const notAvailableProducts = products.filter((p) => !p.is_available).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="bg-[#30442B] text-white rounded-2xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Catalog Management
            </h1>
            <p className="text-sm text-white/80 mt-2">
              Manage your products and categories
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Active Products" value={activeProducts} />
            <StatCard title="Archived Products" value={archivedProducts} />
            <StatCard
              title="Available"
              value={availableProducts}
              change="In Stock"
              trend="up"
            />
            <StatCard
              title="Not Available"
              value={notAvailableProducts}
              change="Out of Stock"
              trend="down"
            />
          </div>

          {/* Action Bar */}
          <div className="bg-[#30442B] rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Products........"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] placeholder-gray-400 text-gray-800 text-sm"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-48">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] text-gray-800 text-sm"
                  >
                    <option value="">CATEGORIES</option>
                    <option value="hot-coffee">Hot Coffee</option>
                    <option value="iced-coffee">Iced Coffee</option>
                    <option value="frappe">Frappe</option>
                    <option value="non-coffee">Non-Coffee</option>
                    <option value="pastries">Pastries</option>
                    <option value="cakes">Cakes</option>
                    <option value="buns">Buns</option>
                  </select>
                  <svg
                    className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="relative w-full sm:w-48">
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-[#415536] bg-white focus:border-[#415536] focus:ring-1 focus:ring-[#415536] text-gray-800 text-sm"
                  >
                    <option value="">AVAILABILITY</option>
                    <option value="available">Available</option>
                    <option value="not-available">Not Available</option>
                  </select>
                  <svg
                    className="w-5 h-5 text-gray-400 absolute right-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Active Products ({filteredProducts.length})
              </h2>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Products</span>
                </button>
                <button className="px-6 py-2.5 bg-[#30442B] text-white rounded-lg hover:bg-[#22301e] transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span>Archive</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30442B]"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No products yet. Click "Add Products" to create your first
                    item.
                  </p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {product.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {product.category}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ₱{Number(product.price).toFixed(2)}
                        </td>
                        <td
                          className="py-4 px-4 text-gray-600 max-w-md truncate"
                          title={product.description}
                        >
                          {product.description}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              product.is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_available
                              ? 'Available'
                              : 'Not Available'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button className="p-2 text-[#30442B] hover:bg-[#30442B]/10 rounded-lg transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import ProductCard from './ProductCard';

export default function ProductsGrid({ products, loading, error, onRetry }) {
  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#30442B]"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30442B]/30 bg-white/70 py-20 text-center">
        <p className="text-xl font-semibold text-[#30442B]">
          Products coming soon.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Please check back later while we brew something special.
        </p>
      </div>
    );
  }

  // Products Grid
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      style={{ gridAutoRows: '1fr' }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

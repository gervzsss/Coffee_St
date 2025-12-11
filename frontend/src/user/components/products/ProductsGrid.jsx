import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

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
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30442B]/30 bg-white/70 py-20 text-center">
        <p className="text-xl font-semibold text-[#30442B]">Products coming soon.</p>
        <p className="mt-2 text-sm text-neutral-500">Please check back later while we brew something special.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" style={{ gridAutoRows: "1fr" }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

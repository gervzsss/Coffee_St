import { formatCurrency } from "../../utils/formatCurrency";

export default function POSProductGrid({ products, onProductSelect }) {
  if (products.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-500">
        <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductSelect(product)}
          disabled={!product.is_available}
          className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all ${
            product.is_available ? "border-gray-200 hover:border-emerald-400 hover:shadow-lg hover:ring-2 hover:ring-emerald-400/20" : "cursor-not-allowed border-gray-100 opacity-60"
          }`}
        >
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Stock Badge */}
            {product.track_stock && (
              <div
                className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                  product.stock_quantity > 5 ? "bg-green-100 text-green-700" : product.stock_quantity > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                }`}
              >
                {product.stock_quantity > 0 ? `${product.stock_quantity} left` : "Out of stock"}
              </div>
            )}

            {/* Unavailable Overlay */}
            {!product.is_available && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-700">Unavailable</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col p-3">
            <span className="mb-1 text-xs font-medium text-emerald-600 uppercase">{product.category}</span>
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
            <span className="mt-auto text-base font-bold text-emerald-600">{formatCurrency(product.price)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

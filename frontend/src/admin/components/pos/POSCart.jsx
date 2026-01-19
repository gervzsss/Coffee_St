import { formatCurrency } from "../../utils/formatCurrency";

export default function POSCart({ items, subtotal, tax, total, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Current Order</h2>
        </div>
        {items.length > 0 && (
          <button onClick={onClearCart} className="text-sm font-medium text-red-600 hover:text-red-700">
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <svg className="mb-3 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Select products to add them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium text-gray-900">{item.product_name}</h4>
                    {item.variants.length > 0 && <p className="mt-1 text-xs text-gray-500">{item.variants.map((v) => `${v.group_name}: ${v.variant_name}`).join(", ")}</p>}
                    <p className="mt-1 text-sm text-gray-600">
                      {formatCurrency(item.unit_price + item.variant_price_delta)} × {item.quantity}
                    </p>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(item.line_total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals & Checkout */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax (12%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="mt-4 w-full rounded-lg bg-emerald-600 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {items.length === 0 ? "Add items to checkout" : `Checkout (${items.reduce((sum, item) => sum + item.quantity, 0)} items)`}
        </button>
      </div>
    </div>
  );
}

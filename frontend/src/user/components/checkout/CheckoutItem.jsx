import { getResponsiveImageUrl } from "../../services/cloudinaryService";
import coffeeBeansImg from "../../../assets/coffeebeans.png";

export default function CheckoutItem({ item }) {
  const getVariantsDisplay = () => {
    if (!item.selected_variants || item.selected_variants.length === 0) {
      return null;
    }

    return item.selected_variants.map((variant) => `${variant.name}: ${variant.option}`).join(", ");
  };

  const getProductImage = (imageUrl) => {
    if (!imageUrl) return coffeeBeansImg;
    return getResponsiveImageUrl(imageUrl, 160);
  };

  return (
    <div className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-gray-100 sm:gap-4 sm:rounded-2xl sm:p-4">
      {/* Product Image */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20 sm:rounded-xl">
        <img
          src={getProductImage(item.image_url || item.product?.image_url)}
          alt={item.product_name || item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = coffeeBeansImg;
          }}
        />
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-gray-900 sm:text-base">{item.product_name || item.name}</h4>

        {getVariantsDisplay() && <p className="mt-0.5 line-clamp-1 text-xs text-gray-600 sm:mt-1 sm:text-sm">{getVariantsDisplay()}</p>}

        <div className="mt-1.5 flex items-center justify-between sm:mt-2">
          <div className="text-xs text-gray-500 sm:text-sm">
            <span>₱{item.unit_price.toFixed(2)}</span>
            {item.price_delta !== 0 && (
              <span className="ml-1 hidden text-gray-400 sm:inline">
                ({item.price_delta > 0 ? "+" : ""}₱{item.price_delta.toFixed(2)})
              </span>
            )}
            <span className="mx-1 sm:mx-2">×</span>
            <span>{item.quantity}</span>
          </div>

          <div className="text-sm font-semibold text-[#30442B] sm:text-base">₱{(item.line_total || 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

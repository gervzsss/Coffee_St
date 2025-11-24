import { getResponsiveImageUrl } from '../services/cloudinaryService';
import coffeeBeansImg from '../../assets/coffeebeans.png';

export default function CheckoutItem({ item }) {
  const getVariantsDisplay = () => {
    if (!item.selected_variants || item.selected_variants.length === 0) {
      return null;
    }

    return item.selected_variants
      .map((variant) => `${variant.name}: ${variant.option}`)
      .join(', ');
  };

  const getProductImage = (imageUrl) => {
    if (!imageUrl) return coffeeBeansImg;
    return getResponsiveImageUrl(imageUrl, 160);
  };

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white ring-1 ring-gray-100">
      {/* Product Image */}
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={getProductImage(item.image_url || item.product?.image_url)}
          alt={item.product_name || item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = coffeeBeansImg;
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">
          {item.product_name || item.name}
        </h4>

        {getVariantsDisplay() && (
          <p className="text-sm text-gray-600 mt-1">{getVariantsDisplay()}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500">
            <span>₱{item.unit_price.toFixed(2)}</span>
            {item.price_delta !== 0 && (
              <span className="ml-1 text-gray-400">
                ({item.price_delta > 0 ? '+' : ''}₱{item.price_delta.toFixed(2)}
                )
              </span>
            )}
            <span className="mx-2">×</span>
            <span>{item.quantity}</span>
          </div>

          <div className="font-semibold text-[#30442B]">
            ₱{(item.line_total || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ProductPricing } from '../../types';

interface PriceDisplayProps {
  pricing: ProductPricing;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

function getDiscountPercent(pricing: ProductPricing): number {
  if (!pricing.is_discounted) return 0;
  if (pricing.discount_type === 'percentage' && pricing.discount_value) {
    return Math.round(parseFloat(pricing.discount_value));
  }
  // Fixed discount
  const original = parseFloat(pricing.original_price);
  const discountAmt = parseFloat(pricing.discount_amount);
  if (original > 0) {
    return Math.round((discountAmt / original) * 100);
  }
  return 0;
}

const sizeClasses = {
  sm: { final: 'text-base font-bold', original: 'text-xs', badge: 'text-xs px-1.5 py-0.5' },
  md: { final: 'text-lg font-bold', original: 'text-sm', badge: 'text-xs px-2 py-0.5' },
  lg: { final: 'text-2xl font-bold', original: 'text-base', badge: 'text-sm px-2.5 py-1' },
};

export function PriceDisplay({ pricing, size = 'md', showBadge = true }: PriceDisplayProps) {
  const s = sizeClasses[size];
  const discountPct = getDiscountPercent(pricing);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`${s.final} text-[#065F46]`}>
        ৳{parseFloat(pricing.final_price).toFixed(2)}
      </span>
      {pricing.is_discounted && (
        <>
          <span className={`${s.original} text-[#78716C] line-through`}>
            ৳{parseFloat(pricing.original_price).toFixed(2)}
          </span>
          {showBadge && discountPct > 0 && (
            <span
              className={`${s.badge} bg-red-100 text-red-700 rounded-full font-semibold border border-red-200`}
            >
              -{discountPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default PriceDisplay;

import { formatPriceFull } from '../../lib/utils';

export default function PricingCard({ price, originalPrice, discount, minimumHours, currency = 'NGN' }) {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium opacity-90">Starting from</p>
        {discount > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
            Save {discount}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{formatPriceFull(price, currency)}</span>
        {originalPrice && originalPrice > price && (
          <span className="text-sm line-through opacity-60">{formatPriceFull(originalPrice, currency)}</span>
        )}
        <span className="text-sm font-medium opacity-90">/hour</span>
      </div>
      <p className="text-sm opacity-80 mt-1">Minimum {minimumHours} hours</p>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { ChevronRight, Tag, Clock, CalendarClock } from 'lucide-react';
import { useOffers, useUpcomingOffers } from '../hooks/useOffers';
import { getImageUrl } from '../utils/image';
import CountdownTimer from '../components/ui/CountdownTimer';
import { Skeleton } from '../components/ui/Skeleton';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OffersPage() {
  const { data: activeOffers, isLoading: activeLoading } = useOffers();
  const { data: upcomingOffers, isLoading: upcomingLoading } = useUpcomingOffers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/" className="hover:text-[#065F46]">Home</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">Offers & Deals</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1C1917]">Offers & Deals</h1>
        <p className="text-[#78716C] mt-2">Limited-time discounts and upcoming promotions</p>
      </div>

      {/* Active Offers */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
            <Tag size={18} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1C1917]">Active Offers</h2>
            <p className="text-xs text-[#78716C]">Grab these deals before they expire</p>
          </div>
        </div>

        {activeLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-64" />
            ))}
          </div>
        ) : !activeOffers || activeOffers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E7E5E4]">
            <Tag size={40} className="text-[#E7E5E4] mx-auto mb-3" />
            <p className="text-[#78716C]">No active offers right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="h-44 bg-[#D1FAE5] relative overflow-hidden">
                  <img
                    src={getImageUrl(offer.product_image)}
                    alt={offer.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {offer.discount_type_display}: {offer.discount_type === 'percentage' ? `${offer.value}%` : `৳${offer.value}`} OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#1C1917] mb-0.5">{offer.title}</h3>
                  <p className="text-xs text-[#78716C] mb-3 line-clamp-2">{offer.description}</p>
                  <p className="text-xs text-[#78716C] mb-2">Product: {offer.product_name}</p>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={12} className="text-[#78716C]" />
                    <span className="text-xs text-[#78716C]">Ends in:</span>
                    <CountdownTimer
                      endsAt={offer.ends_at}
                      remainingSeconds={offer.remaining_seconds}
                      compact
                    />
                  </div>

                  <Link
                    to={`/products/${offer.product_slug}`}
                    className="block w-full bg-[#065F46] text-white text-sm font-medium text-center py-2.5 rounded-lg hover:bg-[#047857] transition-colors"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Offers */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <CalendarClock size={18} className="text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1C1917]">Coming Soon</h2>
            <p className="text-xs text-[#78716C]">Upcoming deals to look forward to</p>
          </div>
        </div>

        {upcomingLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-48" />
            ))}
          </div>
        ) : !upcomingOffers || upcomingOffers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E7E5E4]">
            <CalendarClock size={40} className="text-[#E7E5E4] mx-auto mb-3" />
            <p className="text-[#78716C]">No upcoming offers scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden opacity-80"
              >
                <div className="h-32 bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center">
                  <img
                    src={getImageUrl(offer.product_image)}
                    alt={offer.product_name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      COMING SOON
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#1C1917] mb-0.5">{offer.title}</h3>
                  <p className="text-xs text-[#78716C] mb-2">{offer.product_name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                    <CalendarClock size={12} />
                    Starts: {formatDate(offer.starts_at)}
                  </div>
                  <p className="text-xs text-[#B45309] font-medium mt-1">
                    {offer.discount_type === 'percentage' ? `${offer.value}% off` : `৳${offer.value} off`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

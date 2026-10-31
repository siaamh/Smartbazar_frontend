import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { Skeleton } from '../components/ui/Skeleton';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function OrderHistoryPage() {
  const { data: ordersData, isLoading, error } = useOrders();
  const orders = ordersData?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/account" className="hover:text-[#065F46]">Account</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">Order History</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#1C1917] mb-8">My Orders</h1>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-24" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-[#DC2626]">Failed to load orders.</div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center">
          <ShoppingBag size={56} className="text-[#E7E5E4] mb-4" />
          <h3 className="font-semibold text-[#1C1917] mb-2">No orders yet</h3>
          <p className="text-sm text-[#78716C] mb-5">Start shopping to place your first order.</p>
          <Link to="/shop" className="text-sm text-[#065F46] font-medium hover:underline">
            Browse products →
          </Link>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.order_number}`}
              className="block bg-white rounded-xl border border-[#E7E5E4] p-5 hover:shadow-md hover:border-[#065F46]/30 transition-all group"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[#065F46]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1917] group-hover:text-[#065F46] transition-colors">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-[#78716C]">
                      {new Date(order.created_at).toLocaleDateString('en-BD', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                      {' · '}
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status_display}
                  </span>
                  <span className="font-bold text-[#065F46]">৳{parseFloat(order.total_amount).toFixed(2)}</span>
                  <ChevronRight size={16} className="text-[#78716C] group-hover:text-[#065F46]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

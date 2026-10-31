import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { Skeleton } from '../components/ui/Skeleton';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: orderData, isLoading } = useOrder(orderNumber!);
  const order = orderData?.data;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <Skeleton variant="circle" className="w-20 h-20 mx-auto mb-6" />
        <Skeleton variant="text" className="w-64 h-8 mx-auto mb-4" />
        <Skeleton variant="card" className="h-48" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[#DC2626]">Order not found.</p>
        <Link to="/account/orders" className="text-[#065F46] hover:underline mt-4 block">View all orders →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-[#065F46]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Order Placed!</h1>
        <p className="text-[#78716C] mt-2">
          Thank you for your order. We'll confirm it shortly.
        </p>
        <p className="text-sm font-semibold text-[#065F46] mt-2 bg-[#D1FAE5] inline-block px-4 py-1.5 rounded-full">
          Order #{order.order_number}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden mb-6">
        {/* Status */}
        <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center justify-between">
          <span className="text-sm font-medium text-[#78716C]">Status</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
            {order.status_display}
          </span>
        </div>

        {/* Items */}
        <div className="px-5 py-4 border-b border-[#E7E5E4]">
          <p className="text-xs font-semibold text-[#78716C] uppercase mb-3">Items Ordered</p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1C1917]">{item.product_name}</p>
                  <p className="text-xs text-[#78716C]">
                    ৳{parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">৳{parseFloat(item.subtotal).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="px-5 py-4 border-b border-[#E7E5E4] space-y-2">
          <p className="text-xs font-semibold text-[#78716C] uppercase mb-2">Delivery Details</p>
          <div className="flex items-start gap-2 text-sm">
            <Package size={14} className="text-[#065F46] mt-0.5 flex-shrink-0" />
            <span className="text-[#1C1917]">{order.full_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-[#065F46] flex-shrink-0" />
            <span className="text-[#1C1917]">{order.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={14} className="text-[#065F46] mt-0.5 flex-shrink-0" />
            <span className="text-[#1C1917]">{order.delivery_address}</span>
          </div>
        </div>

        {/* Totals */}
        <div className="px-5 py-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#78716C]">Subtotal</span>
            <span>৳{parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Delivery fee</span>
            <span>৳{parseFloat(order.delivery_fee).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-[#E7E5E4]">
            <span>Total</span>
            <span className="text-[#065F46]">৳{parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#78716C]">
            <span>Payment</span>
            <span>{order.payment_status_display}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/shop"
          className="flex-1 flex items-center justify-center gap-2 border border-[#065F46] text-[#065F46] py-3 rounded-xl font-semibold text-sm hover:bg-[#D1FAE5] transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account/orders"
          className="flex-1 flex items-center justify-center gap-2 bg-[#065F46] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors"
        >
          View Orders <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

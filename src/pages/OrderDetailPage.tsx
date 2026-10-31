import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Package, MapPin, Phone, User, AlertTriangle } from 'lucide-react';
import { useOrder, useCancelOrder } from '../hooks/useOrders';
import { Skeleton } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: orderData, isLoading } = useOrder(orderNumber!);
  const cancelOrder = useCancelOrder();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const order = orderData?.data;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" className="h-32" />)}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package size={48} className="text-[#E7E5E4] mx-auto mb-4" />
        <p className="text-[#78716C]">Order not found.</p>
        <Link to="/account/orders" className="text-[#065F46] hover:underline mt-4 block">← Back to orders</Link>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-[#78716C] mb-6">
        <Link to="/account" className="hover:text-[#065F46]">Account</Link>
        <ChevronRight size={12} />
        <Link to="/account/orders" className="hover:text-[#065F46]">Orders</Link>
        <ChevronRight size={12} />
        <span className="text-[#1C1917] font-medium">#{order.order_number}</span>
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917]">Order #{order.order_number}</h1>
          <p className="text-sm text-[#78716C] mt-0.5">
            Placed {new Date(order.created_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
            {order.status_display}
          </span>
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmCancel(true)}
              className="text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden mb-5">
        <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#E7E5E4]">
          <p className="text-sm font-semibold text-[#78716C] uppercase tracking-wide">Items</p>
        </div>
        <div className="divide-y divide-[#E7E5E4]">
          {order.items.map((item) => (
            <div key={item.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1917]">{item.product_name}</p>
                <p className="text-xs text-[#78716C] mt-0.5">
                  ৳{parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                  {parseFloat(item.discount_amount) > 0 && (
                    <span className="ml-2 text-red-600">
                      (saved ৳{(parseFloat(item.discount_amount) * item.quantity).toFixed(2)})
                    </span>
                  )}
                </p>
              </div>
              <p className="font-semibold text-[#1C1917]">৳{parseFloat(item.subtotal).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Delivery info */}
        <div className="bg-white rounded-xl border border-[#E7E5E4] p-5">
          <p className="text-xs font-semibold text-[#78716C] uppercase mb-3">Delivery To</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={13} className="text-[#065F46]" />
              <span>{order.full_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={13} className="text-[#065F46]" />
              <span>{order.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={13} className="text-[#065F46] mt-0.5" />
              <span>{order.delivery_address}</span>
            </div>
          </div>
        </div>

        {/* Payment & totals */}
        <div className="bg-white rounded-xl border border-[#E7E5E4] p-5">
          <p className="text-xs font-semibold text-[#78716C] uppercase mb-3">Payment Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#78716C]">Subtotal</span>
              <span>৳{parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716C]">Delivery</span>
              <span>৳{parseFloat(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-[#E7E5E4]">
              <span>Total</span>
              <span className="text-[#065F46]">৳{parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#78716C]">
              <span>Method</span>
              <span>Cash on Delivery</span>
            </div>
            <div className="flex justify-between text-xs text-[#78716C]">
              <span>Payment status</span>
              <span>{order.payment_status_display}</span>
            </div>
          </div>
        </div>
      </div>

      <Link to="/account/orders" className="text-sm text-[#065F46] font-medium hover:underline">
        ← Back to orders
      </Link>

      {/* Cancel confirm modal */}
      <Modal
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancel Order"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#78716C]">
              Are you sure you want to cancel order #{order.order_number}? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md" onClick={() => setConfirmCancel(false)} className="flex-1">
              Keep Order
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={cancelOrder.isPending}
              onClick={async () => {
                await cancelOrder.mutateAsync(order.order_number);
                setConfirmCancel(false);
              }}
              className="flex-1 !bg-red-600 hover:!bg-red-700"
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

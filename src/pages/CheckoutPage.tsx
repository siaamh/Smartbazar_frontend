import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useCreateOrder } from '../hooks/useOrders';
import { getImageUrl } from '../utils/image';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

const DELIVERY_FEE = 60;

const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Full name is required (min 2 characters)'),
  phone: z.string().min(7, 'Phone number is required'),
  delivery_address: z.string().min(10, 'Please enter a complete delivery address'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();

  const cart = cartData?.data;
  const items = cart?.items || [];

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate('/cart');
    }
  }, [cartLoading, items.length, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
  const total = subtotal + DELIVERY_FEE;

  const onSubmit = async (data: CheckoutFormData) => {
    const result = await createOrder.mutateAsync(data);
    if (result.success && result.data) {
      navigate(`/order-confirmation/${result.data.order_number}`);
    }
  };

  if (cartLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton variant="text" className="w-48 h-8 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="text" className="h-12" />)}
          </div>
          <Skeleton variant="card" className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1C1917] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Delivery form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E5E4] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Truck size={18} className="text-[#065F46]" />
                <h2 className="text-lg font-bold text-[#1C1917]">Delivery Information</h2>
              </div>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={errors.full_name?.message}
                  {...register('full_name')}
                />
                <Input
                  label="Phone Number"
                  placeholder="+880 1XXX-XXXXXX"
                  type="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#1C1917]">Delivery Address</label>
                  <textarea
                    placeholder="Enter your complete delivery address (house/flat, road, area, city)"
                    rows={4}
                    className={`
                      w-full bg-white border rounded-lg px-3 py-2.5 text-sm text-[#1C1917]
                      placeholder:text-[#78716C] resize-none transition-colors
                      focus:outline-none focus:ring-2 focus:ring-[#065F46]/30 focus:border-[#065F46]
                      ${errors.delivery_address ? 'border-[#DC2626]' : 'border-[#E7E5E4]'}
                    `}
                    {...register('delivery_address')}
                  />
                  {errors.delivery_address && (
                    <p className="text-xs text-[#DC2626]">{errors.delivery_address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-[#E7E5E4] p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-[#065F46]" />
                <h2 className="text-lg font-bold text-[#1C1917]">Payment Method</h2>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#D1FAE5] border-2 border-[#065F46] rounded-xl">
                <div className="w-5 h-5 rounded-full bg-[#065F46] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#065F46] text-sm">Cash on Delivery</p>
                  <p className="text-xs text-[#065F46]/70">Pay when your order arrives</p>
                </div>
              </div>
              <p className="text-xs text-[#78716C] mt-3 flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#065F46]" />
                Secure checkout — no online payment required
              </p>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="bg-white rounded-xl border border-[#E7E5E4] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#1C1917] mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1C1917] line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-[#78716C]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1C1917]">
                      ৳{parseFloat(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#E7E5E4] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Delivery fee</span>
                  <span>৳{DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[#E7E5E4]">
                  <span>Total</span>
                  <span className="text-[#065F46]">৳{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={createOrder.isPending}
                className="w-full mt-5"
              >
                Place Order — ৳{total.toFixed(2)}
              </Button>

              <p className="text-xs text-center text-[#78716C] mt-3">
                By placing your order, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

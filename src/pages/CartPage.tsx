import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, LogIn } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { getImageUrl } from '../utils/image';
import { Skeleton } from '../components/ui/Skeleton';

const DELIVERY_FEE = 60;

export default function CartPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';

  const { data: cartData, isLoading, error } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart size={56} className="text-[#E7E5E4] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1C1917] mb-2">Sign in to view your cart</h2>
        <p className="text-[#78716C] mb-6">Create an account or sign in to start shopping.</p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#065F46] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors"
          >
            <LogIn size={16} /> Sign in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 border border-[#065F46] text-[#065F46] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#D1FAE5] transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart size={56} className="text-[#E7E5E4] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1C1917] mb-2">Cart not available</h2>
        <p className="text-[#78716C]">The cart is only available for customer accounts.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-[#1C1917] mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-28" />
            ))}
          </div>
          <Skeleton variant="card" className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-[#DC2626]">Failed to load cart. Please try again.</p>
      </div>
    );
  }

  const cart = cartData?.data;
  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
  const total = cart ? parseFloat(cart.total) : subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart size={56} className="text-[#E7E5E4] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1C1917] mb-2">Your cart is empty</h2>
        <p className="text-[#78716C] mb-6">Start exploring our products and add items to your cart.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#065F46] text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors"
        >
          <ShoppingCart size={16} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#1C1917] mb-8">
        Your Cart <span className="text-[#78716C] font-normal text-lg">({items.length} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E7E5E4] p-4 flex gap-4"
            >
              <Link to={`/products/${item.product}`} className="flex-shrink-0">
                <img
                  src={getImageUrl(item.product_image)}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1C1917] line-clamp-2 text-sm">{item.product_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.is_discounted && (
                    <span className="text-xs text-[#78716C] line-through">
                      ৳{parseFloat(item.original_price).toFixed(2)}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#065F46]">
                    ৳{parseFloat(item.final_unit_price).toFixed(2)}
                  </span>
                  {item.is_discounted && (
                    <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                      -৳{parseFloat(item.discount_amount).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E7E5E4] rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                      disabled={item.quantity <= 1 || updateItem.isPending}
                      className="px-2.5 py-1.5 text-[#78716C] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-sm font-semibold text-[#1C1917] border-x border-[#E7E5E4]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                      disabled={updateItem.isPending}
                      className="px-2.5 py-1.5 text-[#78716C] hover:bg-[#FAF9F6] disabled:opacity-40 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#1C1917]">
                      ৳{parseFloat(item.subtotal).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      disabled={removeItem.isPending}
                      className="text-[#78716C] hover:text-[#DC2626] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-[#E7E5E4] p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-[#1C1917] mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#78716C]">Subtotal ({items.length} items)</span>
              <span className="font-medium">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716C]">Delivery fee</span>
              <span className="font-medium">৳{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#E7E5E4] pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-[#065F46]">৳{(total + DELIVERY_FEE).toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-5 flex items-center justify-center gap-2 w-full bg-[#065F46] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors shadow-sm hover:shadow-md"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </Link>

          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-[#78716C] hover:text-[#065F46] transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

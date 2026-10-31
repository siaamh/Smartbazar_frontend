// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  password2: string;
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductPricing {
  original_price: string;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: string | null;
  discount_amount: string;
  final_price: string;
  is_discounted: boolean;
  offer_title: string | null;
  offer_description: string | null;
  offer_start: string | null;
  offer_end: string | null;
}

export interface Product {
  id: number;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
  brand: number | null;
  brand_name: string | null;
  brand_slug: string | null;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  is_active: boolean;
  is_featured: boolean;
  featured_order: number | null;
  pricing: ProductPricing;
  created_at: string;
  updated_at: string;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  is_featured?: boolean;
  discounted?: boolean;
  min_price?: number;
  max_price?: number;
  ordering?: 'price' | '-price' | 'created_at' | '-created_at' | 'name' | 'featured_order';
  page?: number;
  page_size?: number;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  order: number;
}

export interface Category {
  id: number;
  parent: number | null;
  parent_name: string | null;
  parent_slug: string | null;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  order: number;
  children: Subcategory[];
  created_at: string;
  updated_at: string;
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandFilterParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ─── Offers ───────────────────────────────────────────────────────────────────

export interface Offer {
  id: number;
  product: number;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_type_display: string;
  value: string;
  starts_at: string;
  ends_at: string;
  is_currently_active: boolean;
  remaining_seconds: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  original_price: string;
  discount_type: string | null;
  discount_amount: string;
  final_unit_price: string;
  quantity: number;
  subtotal: string;
  is_discounted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  created_at: string;
  updated_at: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  original_unit_price: string;
  discount_type: string;
  discount_value: string | null;
  discount_amount: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: number;
  order_number: string;
  full_name: string;
  phone: string;
  delivery_address: string;
  subtotal: string;
  delivery_fee: string;
  total_amount: string;
  status: OrderStatus;
  status_display: string;
  payment_method: 'cash_on_delivery';
  payment_status: PaymentStatus;
  payment_status_display: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  full_name: string;
  phone: string;
  delivery_address: string;
}

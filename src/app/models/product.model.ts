export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number
}

export type NewProduct = Omit<Product, 'id' | 'image'> & { image: File; }

export type CartProducts = Omit<Product, 'stockQuantity'> & { orderedQuantity: number; price: number }

export type UpdateProduct = Partial<Omit<Product, 'image'>> & { image: File; }

export type OrderAdmin = Omit<Order, 'orderId'| 'status'> & {
  id: number;
  trackingId: string;
  logisticsPartner: string;
  orderStatus: OrderStatus;
};


export interface cartItems {
  productId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  products: CartProducts[];
  status: OrderStatus;
  totalPrice: number;
  orderDate: Date;
  address: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'FAILED';

export const ORDER_STATUS_VALUES: OrderStatus[] = [
  'PLACED',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED',
  'FAILED',
];

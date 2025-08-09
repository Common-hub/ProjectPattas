export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  active: boolean;
  discount: number;
}

export type NewProduct = Omit<Product, 'id' | 'image'> & { image: File; }

export type CartProducts = Omit<Product, 'stockQuantity'> & { orderedQuantity: number; price: number }

export type UpdateProduct = Partial<Omit<Product, 'image'>> & { image: File; }

export type inCartProduct = Omit<Product, 'id'> & { productId: number }

export type OrderAdmin = Omit<Order, 'orderId' | 'status'> & {
  id: number;
  trackingId: string;
  logisticsPartner: string;
  userName: string;
  userPhone: string;
  address: string;
  orderStatus: OrderStatus;
};

export interface inCart {
  id: number;
  product: inCartProduct;
  quantity: number;
  finalPrice: number;
}

export interface cartItems {
  productId: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  items: [{ product: Product, price: number, quantity: number }];
  status: OrderStatus;
  orderDate: Date;
  address: string;
  trackingId: string;
  logisticsPartner: string;
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

export interface updateOrder {
  id: number;
  trackingId: string;
  orderStatus: string;
  logistictsPartner?: string;
}
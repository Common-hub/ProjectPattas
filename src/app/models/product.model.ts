export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stockQuantity: number
}

export type NewProduct = Omit<Product, 'id' | 'image'> & { image: File; }

export type CartProducts = Omit<Product, 'stockQuantity'> & { orderedQuantity: number }

export type UpdateProduct = Partial<Omit<Product, 'image'>> & { image: File; }

export interface cartItems {
  productId: number;
  quantity: number;
}

export interface Order {
    id:string;
    products: CartProducts[];
    status: OrderStatus;
    totalPrice: number;
    orderDate: Date;
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

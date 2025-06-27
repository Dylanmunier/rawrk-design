export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  createdAt: Date;
  orders: string[]; // order ids
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  dropshippingApiUrl?: string;
  products: string[]; // product ids
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  vendorId: string;
  stock?: number;
  customOptions?: Record<string, string[]>; // ex: color, wheels, etc.
}

export interface Order {
  id: string;
  customerId: string;
  products: Array<{ productId: string; quantity: number; customizations?: Record<string, string> }>;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  vendorId: string;
  trackingNumber?: string;
} 
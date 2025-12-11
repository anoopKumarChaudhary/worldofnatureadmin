export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  category: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  createdAt?: string;
  ingredients?: string;
  sourcing?: string;
  tasteProfile?: string;
  sizes?: { value: string; label: string }[];
  inStock?: boolean;
}

export interface Order {
  _id: string;
  userId?: string;
  userName?: string;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: string;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

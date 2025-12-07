export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
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
  id: string;
  userId: string;
  userName: string;
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
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

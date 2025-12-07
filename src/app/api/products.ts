import client from "./client";
import { Product } from "../types";

export const productsApi = {
  getAll: (params?: Record<string, unknown>) => client.get<Product[]>("/products", { params }),
  getOne: (id: string) => client.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => client.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) => client.put<Product>(`/products/${id}`, data),
  delete: (id: string) => client.delete(`/products/${id}`),
  getCategories: () => client.get<{ [key: string]: number }>("/products/categories"),
};

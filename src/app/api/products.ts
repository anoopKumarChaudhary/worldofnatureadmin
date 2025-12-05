import client from "./client";
import { Product } from "../redux/features/products/productsSlice";

export const productsApi = {
  getAll: (params?: any) => client.get<Product[]>("/products", { params }),
  getOne: (id: string) => client.get<Product>(`/products/${id}`),
  create: (data: any) => client.post<Product>("/products", data),
  update: (id: string, data: any) => client.put<Product>(`/products/${id}`, data),
  delete: (id: string) => client.delete(`/products/${id}`),
  getCategories: () => client.get<{ [key: string]: number }>("/products/categories"),
};

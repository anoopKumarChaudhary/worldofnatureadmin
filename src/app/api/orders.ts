import client from "./client";
import { Order } from "../types";

export const ordersApi = {
  getAll: () => client.get<Order[]>("/orders"),
  getOne: (id: string) => client.get<Order>(`/orders/${id}`),
  create: (data: Partial<Order>) => client.post<Order>("/orders", data),
  updateStatus: (id: string, status: string) =>
    client.put<Order>(`/orders/${id}/status`, { status }),
};

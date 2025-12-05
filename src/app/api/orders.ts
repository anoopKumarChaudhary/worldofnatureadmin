import client from "./client";

export const ordersApi = {
  getAll: () => client.get("/orders"),
  getOne: (id: string) => client.get(`/orders/${id}`),
  create: (data: any) => client.post("/orders", data),
  updateStatus: (id: string, status: string) =>
    client.put(`/orders/${id}/status`, { status }),
};

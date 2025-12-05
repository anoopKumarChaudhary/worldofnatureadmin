import client from "./client";

export const usersApi = {
  getAll: () => client.get("/users"),
  getOne: (id: string) => client.get(`/users/${id}`),
  create: (data: any) => client.post("/users", data),
  update: (id: string, data: any) => client.put(`/users/${id}`, data),
  delete: (id: string) => client.delete(`/users/${id}`),
};

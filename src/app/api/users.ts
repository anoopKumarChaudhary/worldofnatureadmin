import client from "./client";
import { User } from "../types";

export const usersApi = {
  getAll: () => client.get<User[]>("/users"),
  getOne: (id: string) => client.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => client.post<User>("/users", data),
  update: (id: string, data: Partial<User>) => client.put<User>(`/users/${id}`, data),
  delete: (id: string) => client.delete(`/users/${id}`),
};

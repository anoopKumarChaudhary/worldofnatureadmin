import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: "2024-01-17T08:00:00Z",
      isActive: true,
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      createdAt: "2024-01-02T00:00:00Z",
      lastLogin: "2024-01-16T12:00:00Z",
      isActive: true,
    },
    {
      id: "user3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      createdAt: "2024-01-03T00:00:00Z",
      lastLogin: "2024-01-15T10:00:00Z",
      isActive: false,
    },
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@worldofnature.com",
      role: "admin",
      createdAt: "2023-12-01T00:00:00Z",
      lastLogin: "2024-01-17T09:00:00Z",
      isActive: true,
    },
  ],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateUser,
  deleteUser,
} = usersSlice.actions;
export default usersSlice.reducer;

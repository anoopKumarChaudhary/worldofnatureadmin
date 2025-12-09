import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/products/productsSlice";
import ordersReducer from "./features/orders/ordersSlice";
import usersReducer from "./features/users/usersSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    users: usersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

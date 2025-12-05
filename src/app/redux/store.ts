import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/products/productsSlice";
import ordersReducer from "./features/orders/ordersSlice";
import usersReducer from "./features/users/usersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

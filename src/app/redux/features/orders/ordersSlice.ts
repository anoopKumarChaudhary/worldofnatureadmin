import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
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

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [
    {
      id: "ORD001",
      userId: "user1",
      userName: "John Doe",
      items: [
        {
          productId: "1",
          title: "Organic Coconut Oil",
          quantity: 2,
          price: 349,
        },
        {
          productId: "2",
          title: "Pure A2 Cow Ghee",
          quantity: 1,
          price: 1250,
        },
      ],
      total: 1948,
      status: "delivered",
      createdAt: "2024-01-15T10:30:00Z",
      shippingAddress: "123 Main St, City, State 12345",
    },
    {
      id: "ORD002",
      userId: "user2",
      userName: "Jane Smith",
      items: [
        {
          productId: "3",
          title: "Pure Multifloral Honey",
          quantity: 1,
          price: 550,
        },
      ],
      total: 550,
      status: "shipped",
      createdAt: "2024-01-16T14:20:00Z",
      shippingAddress: "456 Oak Ave, Town, State 67890",
    },
    {
      id: "ORD003",
      userId: "user3",
      userName: "Bob Johnson",
      items: [
        {
          productId: "1",
          title: "Organic Coconut Oil",
          quantity: 1,
          price: 349,
        },
      ],
      total: 349,
      status: "pending",
      createdAt: "2024-01-17T09:15:00Z",
      shippingAddress: "789 Pine Rd, Village, State 54321",
    },
  ],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    fetchOrdersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatus,
} = ordersSlice.actions;
export default ordersSlice.reducer;

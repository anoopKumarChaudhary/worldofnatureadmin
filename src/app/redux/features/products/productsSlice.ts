import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [
    {
      id: "1",
      title: "Organic Coconut Oil",
      description: "Pure organic coconut oil extracted from fresh coconuts",
      price: "₹349",
      imageUrl: "/won1.JPG",
      category: "Oils",
      rating: 4.5,
      reviewCount: 128,
      isBestseller: true,
    },
    {
      id: "2",
      title: "Pure A2 Cow Ghee",
      description: "Traditional A2 cow ghee made from grass-fed cows",
      price: "₹1,250",
      imageUrl: "/won2.jpg",
      category: "Ghee",
      rating: 4.8,
      reviewCount: 95,
      isBestseller: true,
    },
    {
      id: "3",
      title: "Pure Multifloral Honey",
      description: "Raw multifloral honey from organic farms",
      price: "₹550",
      imageUrl: "/won3.JPG",
      category: "Honey",
      rating: 4.6,
      reviewCount: 67,
    },
    {
      id: "4",
      title: "Almond Butter",
      description: "Homemade almond butter with no additives",
      price: "₹450",
      imageUrl: "/won4.JPG",
      category: "Nut Butters",
      rating: 4.4,
      reviewCount: 43,
    },
    {
      id: "5",
      title: "Cold Pressed Olive Oil",
      description: "Extra virgin olive oil cold pressed from olives",
      price: "₹650",
      imageUrl: "/won5.JPG",
      category: "Oils",
      rating: 4.7,
      reviewCount: 89,
      isBestseller: true,
    },
  ],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProduct,
  updateProduct,
  deleteProduct,
} = productsSlice.actions;
export default productsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  // key for displying loader
  loading: false,
  // key for storing all the products
  products: [],
  // key for storing products in cart
  cart: [],
  // key for storing products after filtering, sorting or searching
  refinedProducts: [],
  // array of filters that an be applied
  filters: [
    {
      type: "string",
      name: "brand",
      stringValue: [
        "Apple",
        "Samsung",
        "OPPO",
        "Huawei",
        "Microsoft Surface",
        "Infinix",
        "HP Pavilion",
      ],
    },
    {
      type: "string",
      name: "category",
      stringValue: [
        "smartphones",
        "laptops",
        "fragrances",
        "skincare",
        "groceries",
        "home-decoration",
      ],
    },
    {
      type: "numeric",
      name: "price",
      numericValue: [
        { value: "₹0-₹500", lessThan: 500, greaterThan: 0 },
        { value: "₹500-₹1000", lessThan: 1000, greaterThan: 500 },
        { value: "₹1000-₹2500", lessThan: 2500, greaterThan: 1000 },
        { value: "₹2500-₹5000", lessThan: 5000, greaterThan: 2500 },
      ],
    },
    {
      type: "numeric",
      name: "discountPercentage",
      numericValue: [
        { value: "1%-5%", lessThan: 5, greaterThan: 1 },
        { value: "5%-10%", lessThan: 10, greaterThan: 5 },
        { value: "10%-15%", lessThan: 15, greaterThan: 10 },
        { value: "15%-20%", lessThan: 20, greaterThan: 15 },
      ],
    },
  ],
  // object handling filters that are applied at any time
  filtersUsed: { brand: [], category: [], price: [], discountPercentage: [] },
  // object for capturing any error
  error:{}
};

// async method for fetching products using API
export const fetchProducts = createAsyncThunk(
  "shop/fetchProducts",
  async () => {
    let products = [];
    try {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      products = data.products;
    } catch (err) {
      console.log(err);
      throw err;
    }
    if (products === undefined) {
      throw new Error("Unknown error while fetching data");
    }
    return products;
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    updateRefinedProducts: (state, action) => {
      state.refinedProducts = action.payload;
    },
    updateFiltersUsed: (state, action) => {
      state.filtersUsed = action.payload;
    },
    resetFiltersUsed:(state)=>{
      state.filtersUsed= { brand: [], category: [], price: [], discountPercentage: [] }
      state.refinedProducts=state.products;
    },
    increaseQuantityInCart:(state,action)=>{
      state.cart[action.payload].quantity+=1
    },
    decreaseQuantityInCart:(state,action)=>{
      state.cart[action.payload].quantity-=1
    },
    removeProductFromCart:(state, action)=>{
      state.cart.splice(action.payload,1);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.refinedProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = { found: true, msg: action.error.message };
      });
  },
});

export default shopSlice.reducer;

export const { addProductToCart, updateRefinedProducts, updateFiltersUsed,resetFiltersUsed,increaseQuantityInCart,decreaseQuantityInCart,removeProductFromCart } =
  shopSlice.actions;

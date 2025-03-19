// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { productApi } from './productApi'
import { cartApi } from './cartApi' // Ensure cartApi is imported
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer, // Add cartApi reducer
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
    productApi.middleware,
    cartApi.middleware, // Add cartApi middleware
  ],
})

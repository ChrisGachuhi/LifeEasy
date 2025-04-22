// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { productApi } from './productApi'
import { cartApi } from './cartApi'
import cartReducer from './cartSlice'
import { orderApi } from './orderApi'
import orderReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    cart: cartReducer,
    [orderApi.reducerPath]: orderApi.reducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
    productApi.middleware,
    cartApi.middleware,
    orderApi.middleware,
  ],
})

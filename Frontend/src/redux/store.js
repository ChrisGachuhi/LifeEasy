import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { productApi } from './productApi'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    cart: cartReducer,
  },

  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
    productApi.middleware,
  ],
})

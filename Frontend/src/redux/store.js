import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import { productApi } from './productApi'
import { cartApi } from './cartApi'
import { orderApi } from './orderApi'
import { userApi } from './userApi'

import orderReducer from './orderSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    cart: cartReducer,
    order: orderReducer,
  },

  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
    productApi.middleware,
    cartApi.middleware,
    orderApi.middleware,
    userApi.middleware,
  ],
})

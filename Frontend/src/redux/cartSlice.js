import { createSlice } from '@reduxjs/toolkit'
import { cartApi } from './cartApi'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems: [], totalQuantity: 0, totalPrice: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.fetchCart.matchFulfilled,
      (state, action) => {
        state.cartItems = action.payload.items
        state.totalQuantity = action.payload.items.reduce(
          (acc, item) => acc + item.quantity,
          0
        )
        state.totalPrice = action.payload.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        )
      }
    )
  },
})

export default cartSlice.reducer

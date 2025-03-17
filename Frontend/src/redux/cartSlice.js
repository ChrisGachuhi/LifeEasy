import { createSlice } from '@reduxjs/toolkit'

//Initial state of the cart before user action
const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, action) => {
      const { id, name, price, image, quantity } = action.payload
      const existingItem = state.cartItems.find((p) => p.id === id)

      if (existingItem) {
        // If reducing to zero, remove item
        if (existingItem.quantity + quantity <= 0) {
          state.cartItems = state.cartItems.filter((p) => p.id !== id)
        } else {
          existingItem.quantity += quantity
        }
      } else if (quantity > 0) {
        state.cartItems.push({ id, name, price, image, quantity })
      }

      // Recalculate total quantity and price
      state.totalQuantity = state.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      state.totalPrice = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((p) => p.id !== action.payload)

      // Recalculate totals
      state.totalQuantity = state.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
      state.totalPrice = state.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    },

    clearCart: (state) => {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
    },
  },
})

export const { updateCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

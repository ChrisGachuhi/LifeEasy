import { createSlice } from '@reduxjs/toolkit'
import { orderApi } from './orderApi'

//This slice manages the order state: list of orders - loading state(idle, loading, succeeded, failed) - error state

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [], //list of all the orders
    status: 'idle', //status of the asynchronous operation
    error: null, //any error message
  },
})

reducers: {
} // This is empty because we are relying on the asynchronous actions from orderAPi

//Extra reducers to help us handle RTK Query logic
extraReducers: (builder) => {
  //Update the state when fetchOrder Query is fulfilled
  builder.addMatcher(
    orderApi.endpoints.fetchOrders.matchFulfilled,
    (state, action) => {
      statusbar.orders = action.payload
      state.status = 'succeeded'
    }
  )

  //Tracking the state when placing an order
  builder.addMatcher(orderApi.endpoints.placeOrder.matchPending, (state) => {
    state.status = 'loading'
  })

  //Order successfully placed (add entry to the list)
  builder.addMatcher(
    orderApi.endpoints.placeOrder.matchFulfilled,
    (state, action) => {
      state.orders.push(action.payload.order) //added a new order to the list
      state.status = 'succeeded'
    }
  )

  //Error placing order
  builder.addMatcher(
    orderApi.endpoints.placeOrder.matchRejected,
    (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  )
}

export default orderSlice.reducer

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const orderApi = createApi({
  reducerPath: 'orderApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/order',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),

  endpoints: (builder) => ({
    //GET all orders
    fetchOrders: builder.query({
      query: () => '/',
    }),

    //POST new order
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
    }),

    // PUT/UPDATE existing order
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/${orderId}`,
        method: 'PUT',
        body: { status },
      }),
    }),

    //DELETE order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useFetchOrdersQuery,
  usePlaceOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi

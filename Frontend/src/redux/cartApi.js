import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/cart',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    fetchCart: builder.query({
      query: () => '/',
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/add`,
        method: 'POST',
        body: { productId, quantity },
      }),
    }),

    updateCart: builder.mutation({
      query: ({items }) => ({
        url: `/update`,
        method: 'PUT',
        body: { items },
      }),
    }),

    removeFromCart: builder.mutation({
      query: ({ productId }) => ({
        url: `/remove/${productId}`,
        method: 'DELETE',
      }),
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `/clear`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useFetchCartQuery,
  useAddToCartMutation,  // ✅ Ensure this export exists
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi

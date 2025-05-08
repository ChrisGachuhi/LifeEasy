import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const mpesaApi = createApi({
  reducerPath: 'mpesaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/mpesa',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),

  endpoints: (builder) => ({
    initiateStkPush: builder.mutation({
      query: ({
        phoneNumber,
        products,
        transactionDescription,
        shippingAddress,
      }) => ({
        url: '/stkpush',
        method: 'POST',
        body: {
          phoneNumber,
          products,
          transactionDescription,
          shippingAddress,
        },
      }),
    }),
  }),
})

export const { useInitiateStkPushMutation } = mpesaApi

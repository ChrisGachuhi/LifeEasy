import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/auth' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: '/signup',
        method: 'POST',
        body: {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role || 'user',
        },
      }),
    }),
  }),
})


export const {useLoginMutation, useRegisterMutation} = authApi
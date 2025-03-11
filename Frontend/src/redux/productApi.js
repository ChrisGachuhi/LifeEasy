import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/product',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),

  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: () => '/', //GET /api/products
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`, //GET /api/products/:id
    }),

    createProduct: builder.mutation({
      query: (productData) => {
        const formData = new FormData()
        Object.entries(productData).forEach(([key, value]) => {
          formData.append(key, value)
        })

        return {
          url: '/',
          method: 'POST',
          body: formData,
        }
      },
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi

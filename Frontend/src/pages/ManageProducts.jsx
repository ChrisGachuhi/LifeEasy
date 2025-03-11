import { useState } from 'react'
import {
  useCreateProductMutation,
  useFetchAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../redux/productApi'

export const ManageProducts = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  })

  // Track selected product for editing
  const [selectedProductId, setSelectedProductId] = useState(null)

  // API Mutations
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const { data: products = [], refetch } = useFetchAllProductsQuery()

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image selection
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token') // Ensure token is available

    if (!token) {
      alert('Unauthorized: Please log in again.')
      return
    }

    try {
      const productData = new FormData() // Use FormData for image uploads
      Object.entries(formData).forEach(([key, value]) => {
        productData.append(key, value)
      })

      if (selectedProductId) {
        // Update existing product
        await updateProduct({ id: selectedProductId, ...formData }).unwrap()
        alert('Product updated successfully!')
      } else {
        // Create new product
        await createProduct(formData).unwrap()
        alert('Product created successfully!')
      }

      refetch()
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null,
      })
      setSelectedProductId(null)
    } catch (error) {
      console.error('Product creation/update failed', error)
    }
  }

  // Handle product edit
  const handleEdit = (product) => {
    setSelectedProductId(product._id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image, // Image might not be a file object, needs type handling
    })
  }

  // Handle product deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id).unwrap()
      refetch()
    }
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Manage Products</h1>

      {/* Form to create or update a product */}
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md'>
        <input
          type='text'
          name='name'
          placeholder='Product Name'
          value={formData.name}
          onChange={handleChange}
          required
          className='w-full p-2 border mb-3'
        />

        <textarea
          name='description'
          placeholder='Description'
          value={formData.description}
          onChange={handleChange}
          required
          className='w-full p-2 border mb-3'
        />

        <input
          type='number'
          name='price'
          placeholder='Price'
          value={formData.price}
          onChange={handleChange}
          required
          className='w-full p-2 border mb-3'
        />

        <input
          type='text'
          name='category'
          placeholder='Category'
          value={formData.category}
          onChange={handleChange}
          required
          className='w-full p-2 border mb-3'
        />

        <input
          type='number'
          name='stock'
          placeholder='Stock'
          value={formData.stock}
          onChange={handleChange}
          required
          className='w-full p-2 border mb-3'
        />

        <input
          type='file'
          onChange={handleImageChange}
          className='w-full p-2 border mb-3'
        />

        <button
          type='submit'
          className='w-full bg-blue-600 text-white p-3 rounded'>
          {selectedProductId ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {/* Product List */}
      <h2 className='text-2xl font-bold mt-8'>My Products</h2>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p._id} className='flex justify-between p-2 border-b'>
              {p.name}
              <div>
                <button
                  onClick={() => handleEdit(p)}
                  className='text-blue-500 mr-2'>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className='text-red-500'>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

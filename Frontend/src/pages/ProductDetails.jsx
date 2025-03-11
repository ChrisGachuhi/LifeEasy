import { useParams } from 'react-router-dom'
import { useFetchProductByIdQuery } from '../redux/productApi'

export const ProductDetails = () => {
  const { id } = useParams()
  const {
    data: product = [],
    isLoading,
    isError,
  } = useFetchProductByIdQuery(id)

  if (isLoading)
    return <span className='text-center text-md'>Loading product...</span>

  if (isError)
    return (
      <span className='text-center text-md text-red-600'>
        Error fetching produtc...
      </span>
    )

  if (!product)
    return <span className='text-center text-md'>Product not found...</span>

  return (
    <div className='mx-auto p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <img
          src={`http://localhost:5000/${
            product.image.startsWith('uploads')
              ? product.image
              : `uploads/${product.image}`
          }`}
          alt={product.name}
          className='w-full h-96 object-cover rounded-lg shadow-lg'
        />

        <div>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-gray-500'>{product.category}</p>
          <p className='text-2xl font-semibold text-blue-600'>
            ${product.price}
          </p>
          <p className='mt-4 text-gray-700 '>{product.description}</p>

          <p
            className={`mt-2 text-sm font-semibold ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {product.stock > 0
              ? `In stock (${product.stock} available)`
              : 'Out of stock'}
          </p>

          {/* Add to Cart button */}
          <button
            className={`mt-4 px-6 py-2 text-white rounded-lg shadow ${
              product.stock > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={product.stock === 0}>
            Add to Cart
          </button>

          {/* seller info */}

          {product.seller && (
            <p className='mt-4 text-sm text-gray-500'>
              Sold by: {product.seller.username}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

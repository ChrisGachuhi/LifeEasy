import { useParams } from 'react-router-dom'
import { useFetchProductByIdQuery } from '../redux/productApi'
import { useDispatch } from 'react-redux'
import { updateCart } from '../redux/cartSlice'
import { useState } from 'react'

export const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { data: product, isLoading, isError } = useFetchProductByIdQuery(id)
  const [quantity, setQuantity] = useState(1)

  if (isLoading)
    return <span className='text-center text-md'>Loading product...</span>
  if (isError)
    return (
      <span className='text-center text-md text-red-600'>
        Error fetching product...
      </span>
    )
  if (!product)
    return <span className='text-center text-md'>Product not found...</span>

  return (
    <div className='mx-auto p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
          className='w-full h-96 object-cover rounded-lg shadow-lg'
        />
        <div>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-2xl font-semibold text-blue-600'>
            ${product.price}
          </p>
          <p className='mt-4 text-gray-700'>{product.description}</p>

          <div className='mt-4 flex items-center'>
            <button
              className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
              onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>
              -
            </button>
            <span className='mx-3'>{quantity}</span>
            <button
              className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
              onClick={() => setQuantity((q) => q + 1)}>
              +
            </button>
          </div>

          <button
            onClick={() =>
              dispatch(
                updateCart({
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity,
                })
              )
            }
            className='mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

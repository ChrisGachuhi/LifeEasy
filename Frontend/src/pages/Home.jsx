import { Link } from 'react-router-dom'
import { useFetchAllProductsQuery } from '../redux/productApi'

export const Home = () => {
  const { data: products = [], isLoading, isError } = useFetchAllProductsQuery()

  if (isLoading)
    return <span className='text-center text-md'>Loading produtcs...</span>

  if (isError)
    return (
      <span className='text-center text-md text-red-600'>Error fetching produtcs...</span>
    )

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Featured products</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {products.map((product) => (
          <div
            key={product._id}
            className='bg-white p-4 rounded-lg shadow hover:shadow-lg'>
            <img
              src={`http://localhost:5000/${
                product.image.startsWith('uploads')
                  ? product.image
                  : `uploads/${product.image}`
              }`}
              alt={product.name}
              className='w-full h-50 object-cover rounded'
            />
            <h2 className='text-lg font-semibold mt-2'>{product.name}</h2>
            <p className=' text-gray-600'>${product.price}</p>

            <Link
              to={`/product/${product._id}`}
              className='mt-3 inline-block bg-blue-600 text-white px-2 py-0.5 rounded'>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

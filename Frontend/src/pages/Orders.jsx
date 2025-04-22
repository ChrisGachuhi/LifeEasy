import { useFetchOrdersQuery } from '../redux/orderApi'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const Orders = () => {
  // Fetch current authenticated user (helps to check role)
  const { user } = useContext(AuthContext)

  // RTK Query hook to fetch the logged-in user's orders from backend
  const { data: orders = [], isLoading, isError, error } = useFetchOrdersQuery()

  // Handle loading state while waiting for response
  if (isLoading) {
    return <p className='text-center text-gray-500'>Loading orders...</p>
  }

  // Handle error state
  if (isError) {
    return (
      <p className='text-center text-red-500'>
        Error loading orders: {error?.message || 'Unknown error'}
      </p>
    )
  }

  // If no orders found
  if (orders.length === 0) {
    return (
      <div className='text-center p-6'>
        <p className='text-gray-600'>You have no orders yet.</p>
      </div>
    )
  }

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>My Orders</h1>

      <div className='space-y-4'>
        {orders.map((order, index) => (
          <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold'>
                Order #{index + 1} — {order._id}
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded shadow-md ${
                  order.status === 'Pending'
                    ? 'bg-yellow-400'
                    : order.status === 'Shipped'
                    ? 'bg-blue-400'
                    : 'bg-green-500'
                }`}>
                {order.status}
              </span>
            </div>

            {user?.role === 'admin' && (
              <p className='text-sm text-gray-500 mt-1'>
                Ordered by: {order.user.username}
              </p>
            )}

            <ul className='mt-5'>
              {order.products.map((item, idx) => (
                <li
                  key={idx}
                  className='flex justify-between text-gray-600 text-sm'>
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <hr className='my-2' />

            <p className='text-gray-800 font-medium'>
              Total: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

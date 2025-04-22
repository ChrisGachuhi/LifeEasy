import {
  useFetchOrdersQuery,
  useUpdateOrderStatusMutation,
} from '../redux/orderApi'

export const AdminOrders = () => {
  // Fetch all orders (admin has global access)
  const { data: orders = [], isLoading, isError, error } = useFetchOrdersQuery()

  const [updateOrderStatus] = useUpdateOrderStatusMutation()

  // Handle updating the order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap()
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  if (isLoading)
    return <p className='text-center text-gray-500'>Loading orders...</p>

  if (isError)
    return (
      <p className='text-center text-red-500'>
        Failed to load orders: {error?.message || 'Unknown error'}
      </p>
    )

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Manage Orders</h1>

      {/* If no orders at all */}
      {orders.length === 0 ? (
        <p className='text-gray-600 text-center'>No orders yet</p>
      ) : (
        <table className='bg-white w-full border border-collapse border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-3 text-left'>No.</th>
              <th className='p-3 text-left'>Order ID</th>
              <th className='p-3 text-left'>User</th>
              <th className='p-3 text-left'>Total ($)</th>
              <th className='p-3 text-left'>Status</th>
              <th className='p-3 text-left'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id} className='shadow-md'>
                <td className='p-3'>{index + 1}</td>
                <td className='p-3'>{order._id}</td>
                <td className='p-3'>
                  {order.user?.username || 'Unknown User'}
                </td>
                <td className='p-3'>${order.totalAmount.toFixed(2)}</td>
                <td className='p-3'>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className='border p-2 rounded'>
                    <option value='Pending'>Pending</option>
                    <option value='Shipped'>Shipped</option>
                    <option value='Delivered'>Delivered</option>
                  </select>
                </td>

                <td className='p-3 text-gray-400 italic'>N/A</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'

export const AdminDashboard = () => {
  const [stats] = useState({
    users: 200,
    products: 300,
    orders: 1200,
  })

  const [recentOrders] = useState([
    { id: 'ORD001', user: 'John Doe', total: 500, status: 'Pending' },
    { id: 'ORD002', user: 'Jane Smith', total: 1500, status: 'Shipped' },
    { id: 'ORD003', user: 'Mike Johnson', total: 800, status: 'Delivered' },
  ])

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Admin Dashboard</h1>

      {/* App statistics */}
      <div className='grid grid-col-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total users</h2>
          <p className='text-2xl font-bold text-blue-600 py-4'>{stats.users}</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total products</h2>
          <p className='text-2xl font-bold text-blue-600 py-4'>{stats.products}</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total orders</h2>
          <p className='text-2xl font-bold text-blue-600 py-4'>{stats.orders}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold text-center mb-4'>Recent Orders</h2>
        <table className='w-full border border-collapse border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-3 text-left'>Order Id</th>
              <th className='p-3 text-left'>User</th>
              <th className='p-3 text-left'>Total</th>
              <th className='p-3 text-left'>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className='shadow-md'>
                <td className='p-3'>{order.id} </td>
                <td className='p-3'>{order.user} </td>
                <td className='p-3'>{order.total} </td>
                <td
                  className={`p-3 font-bold ${
                    order.status === 'Pending'
                      ? 'text-yellow-500'
                      : order.status === 'Shipped'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin navigation */}

      <div className='flex gap-4'>
        <Link
          to={'/admin/manage-users'}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Manage Users
        </Link>

        <Link
          to={'/admin/manage-orders'}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Manage Orders
        </Link>
      </div>
    </div>
  )
}

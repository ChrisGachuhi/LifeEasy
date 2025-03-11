import { useState } from 'react'
import { Link } from 'react-router-dom'

export const SellerDashboard = () => {
  const [stats] = useState({
    products: 8,
    totalSales: 5400, // Total revenue from all sales
  })

  const [recentOrders] = useState([
    {
      id: 'ORD101',
      buyer: 'John Doe',
      total: 500,
      status: 'Pending',
      products: [{ name: 'iPhone', quantity: 1, price: 500 }],
    },
    {
      id: 'ORD102',
      buyer: 'Jane Smith',
      total: 1500,
      status: 'Shipped',
      products: [{ name: 'Macbook', quantity: 1, price: 1500 }],
    },
  ])

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Seller Dashboard</h1>

      {/* Seller Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total Products</h2>
          <p className='text-2xl font-bold text-blue-600 p-4'>
            {stats.products}
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold'>Total Sales</h2>
          <p className='text-2xl font-bold text-green-600'>
            ${stats.totalSales}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className='text-gray-600'>No recent orders.</p>
        ) : (
          <table className='w-full border border-collapse border-gray-300 rounded-lg'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-3 text-left'>Order ID</th>
                <th className='p-3 text-left'>Buyer</th>
                <th className='p-3 text-left'>Total ($)</th>
                <th className='p-3 text-left'>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className='shadow-md'>
                  <td className='p-3'>{order.id}</td>
                  <td className='p-3'>{order.buyer}</td>
                  <td className='p-3'>${order.total}</td>
                  <td
                    className={`p-3 font-bold ${
                      order.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Seller Navigation*/}

      <div className='flex gap-4'>
        <Link
          to='/manage-products'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Manage Products
        </Link>
        <Link
          to='/manage-orders'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Manage Orders
        </Link>
      </div>
    </div>
  )
}

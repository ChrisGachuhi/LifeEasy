import { useState } from 'react'

export const AdminOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      user: 'JohnDoe',
      total: 500,
      status: 'Pending',
      products: [{ name: 'iPhone', quantity: 1, price: 500 }],
    },
    {
      id: 'ORD002',
      user: 'JaneSmith',
      total: 1500,
      status: 'Shipped',
      products: [{ name: 'Macbook', quantity: 1, price: 1500 }],
    },
    {
      id: 'ORD003',
      user: 'MikeJohnson',
      total: 800,
      status: 'Delivered',
      products: [
        { name: 'Headphones', quantity: 1, price: 200 },
        { name: 'Tablet', quantity: 1, price: 600 },
      ],
    },
  ])

  const updateStatus = (id, newStatus) => {
    setOrders((prevOders) =>
      prevOders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    )
  }

  const deleteOrder = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id))
  }

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Manage Orders</h1>

      {/* List ordes */}

      {orders.length === 0 ? (
        <p className='text-gray-600 text-center'>No orders yet</p>
      ) : (
        <table className='bg-white w-full border border-collapse border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border- p-3 text-left'>No.</th>
              <th className='border- p-3 text-left'>Order ID</th>
              <th className='border- p-3 text-left'>User</th>
              <th className='border- p-3 text-left'>Total ($)</th>
              <th className='border- p-3 text-left'>Status</th>
              <th className='border- p-3 text-left'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className='shadow-md'>
                <td className='p-3'> {index + 1} </td>
                <td className='p-3'> {order.id} </td>
                <td className='p-3'> {order.user} </td>
                <td className='p-3'> {order.total} </td>
                <td className='p-3'>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className='border p-2 rounded'>
                    <option value='Pending'>Pending</option>
                    <option value='Shipped'>Shipped</option>
                    <option value='Delivered'>Delivered</option>
                  </select>
                </td>

                <td className='p-3'>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

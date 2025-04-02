import { useState } from 'react'

export const Orders = () => {
  const date = new Date.now()
  console.log(date)

  const orderList = [
    {
      id: 'ORD001',
      user: {
        username: 'John Doe',
      },
      products: [
        {
          name: 'iPhone',
          price: 500,
          quantity: 1,
        },
        { name: 'macbook', price: 1500, quantity: 1 },
      ],
      total: 2000,
      status: 'Pending',
    },
    {
      id: 'ORD002',
      user: {
        username: 'John Doe',
      },
      products: [
        {
          name: 'iPhone',
          price: 500,
          quantity: 2,
        },
        { name: 'macbook', price: 1500, quantity: 1 },
      ],
      total: 3000,
      status: 'Shipped',
    },
  ]

  const [role, setRole] = useState('admin')
  const [orders, setOrders] = useState(orderList)

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>My Orders</h1>

      {orders.length === 0 ? (
        <p className='text-gray-600'>No orders yet</p>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div key={order.id} className='bg-white p-4 rounded-lg shadow md'>
              <div className='flex justify-between'>
                <h2 className='text-lg font-semibold'>Order ID: {order.id}</h2>
                <span
                  className={`text-sm px-3 py-1 rounded shadow-md ${
                    order.status === 'Pending'
                      ? 'bg-yellow-400'
                      : 'bg-green-500'
                  }`}>
                  {order.status}
                </span>
              </div>

              {role === 'admin' && (
                <p className='text-sm text-gray-500 '>
                  Ordered by: {order.user.username}
                </p>
              )}

              <ul className='mt-5'>
                {order.products.map((product, index) => (
                  <li
                    key={index}
                    className='flex justify-between text-gray-500'>
                    <span>
                      {product.name} x {product.quantity}
                    </span>
                    <span> ${product.price * product.quantity} </span>
                  </li>
                ))}
              </ul>

              <hr className='my-2' />

              <p className='text-gray-700'>
                Total: <span className='font-bold'>${order.total}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

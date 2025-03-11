
import { useState } from 'react'
import { Link } from 'react-router-dom'
import iPhone from '../assets/iPhone.jpeg'
import macbook from '../assets/macbook.webp'

export const Cart = () => {
  const cartItems = [
    { id: 1, name: 'iPhone', price: 500, image: iPhone, quantity: 1 },
    { id: 2, name: 'Macbook', price: 1500, image: macbook, quantity: 1 },
  ]

  const [items, setItems] = useState(cartItems)

  const updateQuantity = (id, amount) => {
    setItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setItems((prevCart) => prevCart.filter((item) => item.id !== id))
    console.log('hi')
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Shopping Cart</h1>
      {items.length === 0 ? (
        <p>
          Your cart is empty. <Link to={'/'}>Go shopping</Link>
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {items.map((item) => (
            <div
              key={item.id}
              className='flex items-center bg-white p-4 rounded-4 shadow-md mb-4'>
              <img
                src={item.image}
                alt={item.name}
                className='w-20 h-30 object-cover rounded-lg'
              />
              <div className='ml-4 flex-1'>
                <h2 className='text-lg font-semibold'>{item.name}</h2>
                <p className='text-gray-600'>${item.price}</p>
                <div className='flex items-center mt-2'>
                  <button
                    className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                    onClick={() => updateQuantity(item.id, -1)}>
                    -
                  </button>

                  <span className='mx-3'>{item.quantity}</span>

                  <button
                    className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                    onClick={() => updateQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>

              <button
                className='px-3 py-1 bg-red-500 rounded hover:bg-red-700 text-white'
                onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-4 text-center'>
          Order Summary
        </h2>
        <p className='text-gray-700'>
          Total Price:
          <span className='font-bold'>${totalPrice.toFixed(2)}</span>
        </p>
        <Link to={'/checkout'}>
          <button className='w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700'>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  )
}

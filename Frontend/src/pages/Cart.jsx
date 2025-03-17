import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateCart, removeFromCart, clearCart } from '../redux/cartSlice'

export const Cart = () => {
  const cart = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Shopping Cart</h1>
      {cart.cartItems.length === 0 ? (
        <p className='text-center text-gray-600'>
          Your cart is empty.{' '}
          <Link to={'/'} className='text-blue-600'>
            Go shopping
          </Link>
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {cart.cartItems.map((item) => (
            <div
              key={item.id}
              className='flex items-center bg-white p-4 rounded-lg shadow-md mb-4'>
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.name}
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div className='ml-4 flex-1'>
                <h2 className='text-lg font-semibold'>{item.name}</h2>
                <p className='text-gray-600'>${item.price}</p>
                <div className='flex items-center mt-2'>
                  <button
                    className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                    onClick={() =>
                      dispatch(updateCart({ id: item.id, quantity: -1 }))
                    }>
                    -
                  </button>

                  <span className='mx-3'>{item.quantity}</span>

                  <button
                    className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                    onClick={() =>
                      dispatch(
                        updateCart({ id: item.id, quantity: 1, product: item })
                      )
                    }>
                    +
                  </button>
                </div>
              </div>

              <button
                className='px-3 py-1 bg-red-500 rounded hover:bg-red-700 text-white'
                onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {cart.cartItems.length > 0 && (
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4 text-center'>
            Order Summary
          </h2>
          <p className='text-gray-700'>
            Total Price:
            <span className='font-bold'>${cart.totalPrice.toFixed(2)}</span>
          </p>
          <button
            onClick={() => dispatch(clearCart())}
            className='w-full bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700'>
            Clear Cart
          </button>
          <Link to={'/checkout'}>
            <button className='w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700'>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

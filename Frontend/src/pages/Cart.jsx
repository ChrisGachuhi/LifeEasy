import { Link, useNavigate } from 'react-router-dom'
import {
  useFetchCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from '../redux/cartApi'
import { useState, useEffect } from 'react'

const Cart = () => {
  const { data: cartData, isLoading, error, refetch } = useFetchCartQuery()
  const [updateCart] = useUpdateCartMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [clearCart] = useClearCartMutation()
  const [quantities, setQuantities] = useState({})

  const navigate = useNavigate()

  // Initialize quantity state when cart data is available
  useEffect(() => {
    if (cartData) {
      const initialQuantities = cartData.items.reduce((acc, item) => {
        acc[item.product._id] = item.quantity
        return acc
      }, {})
      setQuantities(initialQuantities)
    }
  }, [cartData])

  if (isLoading) return <p className='text-center'>Loading cart...</p>
  if (error)
    return (
      <p className='text-red-500 text-center'>
        Error loading cart: {error.message}
      </p>
    )

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className='text-center p-6'>
        <p>Your cart is empty.</p>
        <Link to='/' className='text-blue-600'>
          Go shopping
        </Link>
      </div>
    )
  }

  // Handle quantity changes locally
  const handleQuantityChange = (productId, amount) => {
    setQuantities((prev) => {
      const newQuantity = Math.max((prev[productId] || 1) + amount, 1)
      return { ...prev, [productId]: newQuantity }
    })
  }

  // Handle item removal with UI update
  const handleRemoveFromCart = async (productId) => {
    await removeFromCart({ productId }) // Remove from backend
    refetch() // Refresh UI with latest data
  }

  // Handle cart clearing
  const handleClearCart = async () => {
    await clearCart() // Clear backend cart
    refetch() // Refresh UI with empty cart
  }

  // Handle checkout (sync cart with backend)
const handleCheckout = async () => {
  try {
    const updatedCart = cartData.items.map((item) => ({
      productId: item.product._id,
      quantity: quantities[item.product._id],
    }))

    await updateCart({ items: updatedCart }) // Send bulk update to backend

    refetch() // Ensure UI updates with latest data

    navigate('/checkout') // Redirect to checkout after update
  } catch (error) {
    console.error('Error updating cart before checkout:', error)
  }
}


  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Shopping Cart</h1>
      <ul className='bg-white p-6 rounded-lg shadow-md'>
        {cartData.items.map((item) => (
          <li
            key={item.product._id}
            className='flex items-center justify-between border-b p-4'>
            <img
              src={`http://localhost:5000/${item.product.image}`}
              alt={item.product.name}
              className='w-20 h-20 object-cover rounded-lg'
            />
            <span className='flex-1 ml-4 text-lg font-semibold'>
              {item.product.name}
            </span>
            <span className='text-gray-600'>${item.product.price}</span>

            {/* Quantity Controls */}
            <div className='flex items-center'>
              <button
                className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                onClick={() => handleQuantityChange(item.product._id, -1)}
                disabled={quantities[item.product._id] <= 1}>
                -
              </button>

              <span className='mx-3'>{quantities[item.product._id]}</span>

              <button
                className='px-2 py-1 bg-gray-300 rounded hover:bg-gray-400'
                onClick={() => handleQuantityChange(item.product._id, 1)}>
                +
              </button>
            </div>

            {/* Remove Item */}
            <button
              className='px-3 py-1 bg-red-500 rounded hover:bg-red-700 text-white ml-4'
              onClick={() => handleRemoveFromCart(item.product._id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Order Summary */}
      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h2 className='text-xl font-semibold mb-4 text-center'>
          Order Summary
        </h2>
        <p className='text-gray-700'>
          Total Items:{' '}
          <span className='font-bold'>
            {cartData.items.reduce(
              (acc, item) => acc + (quantities[item.product._id] ?? 1),
              0
            )}
          </span>
        </p>
        <p className='text-gray-700'>
          Total Price:
          <span className='font-bold'>
            $
            {cartData.items
              .reduce(
                (acc, item) =>
                  acc +
                  item.product.price * (quantities[item.product._id] ?? 1),
                0
              )
              .toFixed(2)}
          </span>
        </p>

        {/* Clear Cart */}
        <button
          onClick={handleClearCart}
          className='w-full bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-700'>
          Clear Cart
        </button>

        {/* Checkout */}
        <button
          onClick={handleCheckout}
          className='w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700'>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart

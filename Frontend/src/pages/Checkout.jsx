import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClearCartMutation, useFetchCartQuery } from '../redux/cartApi'
import { usePlaceOrderMutation } from '../redux/orderApi'

export const Checkout = () => {
  const { data: cartItems, isLoading, error } = useFetchCartQuery()
  const [placeOrder] = usePlaceOrderMutation()
  const [clearCart] = useClearCartMutation()

  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    fullname: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('card')

  //Handle change
  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
  }

  // Handle Order Submission
  const handleOrder = async (e) => {
    e.preventDefault()

    // Validate that all cart items contain a valid product ID
    const hasInvalidProduct = cartItems.items.some(
      (item) => !item.product || !item.product._id
    )

    if (hasInvalidProduct) {
      alert('One or more products in your cart are invalid or unavailable.')
      return
    }

    // Create payload by extracting product ID and quantity only
    const orderPayload = {
      products: cartItems.items.map((item) => ({
        product: item.product._id, // ✅ use only the ID
        quantity: item.quantity,
      })),
      paymentMethod,
      shippingAddress: shippingInfo,
    }

    try {
      await placeOrder(orderPayload).unwrap() // send request to backend
      await clearCart() // clear the cart after successful order
      alert('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Order failed. Please check product availability and try again.')
    }
  }

  //Calculate the total price
  const totalPrice = cartItems?.items
    ?.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
    .toFixed(2) // <- move toFixed here after accumulation

  if (isLoading) return <p>Loading cart...</p>
  if (error) return <p className='text-red-500'>Failed to load cart.</p>
  if (!cartItems?.items?.length) return <p>Your cart is empty.</p>

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Shipping Form */}
        <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Shipping Details</h2>
          <form onSubmit={handleOrder}>
            <input
              type='text'
              name='fullname'
              placeholder='Fullname'
              required
              value={shippingInfo.fullname}
              className='w-full p-3 border rounded mb-3'
              onChange={handleChange}
            />
            <input
              type='address'
              name='address'
              placeholder='Address'
              required
              value={shippingInfo.address}
              className='w-full p-3 border rounded mb-3'
              onChange={handleChange}
            />
            <input
              type='city'
              name='city'
              placeholder='City'
              required
              value={shippingInfo.city}
              className='w-full p-3 border rounded mb-3'
              onChange={handleChange}
            />
            <input
              type='postalCode'
              name='postalCode'
              placeholder='Postal Code'
              required
              value={shippingInfo.postalCode}
              className='w-full p-3 border rounded mb-3'
              onChange={handleChange}
            />

            {/* Payment Selection */}
            <h2 className='text-xl font-semibold mt-6 mb-2'>Payment Method</h2>
            <div className='flex gap-4'>
              {['card', 'cod', 'mpesa'].map((method) => (
                <label key={method} className='flex items-center'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className='mr-2'
                  />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700'>
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
          {cartItems.items.map((item) => (
            <div key={item.product._id} className='flex justify-between mb-4'>
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span> ${(item.product.price * item.quantity).toFixed(2)} </span>
            </div>
          ))}

          <hr className='my-3' />
          <p className='text-gray-700'>
            Total Price:
            <span className='font-bold'> ${totalPrice} </span>
          </p>
        </div>
      </div>
    </div>
  )
}

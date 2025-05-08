import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClearCartMutation, useFetchCartQuery } from '../redux/cartApi'
import { usePlaceOrderMutation } from '../redux/orderApi'
import { useInitiateStkPushMutation } from '../redux/mpesaApi'

export const Checkout = () => {
  const { data: cartItems, isLoading, error } = useFetchCartQuery()
  const [placeOrder] = usePlaceOrderMutation()
  const [clearCart] = useClearCartMutation()
  const [initiateStkPush] = useInitiateStkPushMutation()
  const [paymentError, setPaymentError] = useState(null)

  const navigate = useNavigate()

  const [shippingInfo, setShippingInfo] = useState({
    fullname: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [phoneNumber, setPhoneNumber] = useState('') // for M-PESA

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
  }

  const handleOrder = async (e) => {
    e.preventDefault()
    setPaymentError(null)

    const hasInvalidProduct = cartItems.items.some(
      (item) => !item.product || !item.product._id
    )
    if (hasInvalidProduct) {
      setPaymentError(
        'One or more products in your cart are invalid or unavailable.'
      )
      return
    }

    const products = cartItems.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }))

    try {
      // M-PESA PAYMENT
      if (paymentMethod === 'mpesa') {
        if (!phoneNumber.match(/^2547\d{8}$/)) {
          setPaymentError(
            'Enter a valid Safaricom number in 2547XXXXXXXX format'
          )
          return
        }

        // Make sure the token is valid before proceeding
        const token = localStorage.getItem('token')
        if (!token) {
          setPaymentError('Authentication required. Please log in again.')
          navigate('/login')
          return
        }

        const result = await initiateStkPush({
          phoneNumber,
          products,
          shippingAddress: shippingInfo,
          transactionDesc: 'Payment for LifeEasy Order',
        }).unwrap()

        alert('M-PESA prompt sent. Complete payment on your phone.')
        navigate('/orders')
        return
      }

      // CARD / COD PAYMENT
      const orderPayload = {
        products,
        paymentMethod,
        shippingAddress: shippingInfo,
      }

      await placeOrder(orderPayload).unwrap()
      await clearCart()
      alert('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      console.error('Payment Error:', err)
      setPaymentError(
        err.data?.error || 'Order/payment failed. Please try again.'
      )
    }
  }

  const totalPrice = cartItems?.items
    ?.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    .toFixed(2)

  if (isLoading) return <p>Loading cart...</p>
  if (error) return <p className='text-red-500'>Failed to load cart.</p>
  if (!cartItems?.items?.length) return <p>Your cart is empty.</p>

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>

      {paymentError && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {paymentError}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Shipping Details */}
        <div className='md:col-span-2 bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Shipping Details</h2>
          <form onSubmit={handleOrder}>
            {['fullname', 'address', 'city', 'postalCode'].map((field) => (
              <input
                key={field}
                name={field}
                required
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={shippingInfo[field]}
                onChange={handleChange}
                className='w-full p-3 border rounded mb-3'
              />
            ))}

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
                  {method.toUpperCase()}
                </label>
              ))}
            </div>

            {paymentMethod === 'mpesa' && (
              <input
                type='number'
                placeholder='Safaricom number (2547XXXXXXXX)'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className='w-full p-3 border rounded mt-4'
              />
            )}

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
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
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

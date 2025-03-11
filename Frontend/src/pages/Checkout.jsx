import { useState } from 'react'
import iPhone from '../assets/iPhone.jpeg'
import macbook from '../assets/macbook.webp'
import { useNavigate } from 'react-router-dom'

export const Checkout = () => {
  const cartItems = [
    { id: 1, name: 'iPhone', price: 500, image: iPhone, quantity: 1 },
    { id: 2, name: 'Macbook', price: 1500, image: macbook, quantity: 1 },
  ]

  const [shippingInfo, setShippingInfo] = useState({
    fullname: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('card')

  const navigate = useNavigate()

  //Calculate the total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  //Handle change
  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
  }

  //Handle Order Submission
  const handleOrder = (e) => {
    e.preventDefault()
    alert('Order successfully placed')
    navigate('/')
  }

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Checkout</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Shipping Details Form */}
        <div className=':mdcol-span-2 bg-white p-6 rounded-lg shadow-md'>
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

            {/* Select Payment Method */}
            <h2 className='text-xl font-semibold mt-6 mb-2'>Payment Method</h2>
            <div className='flex gap-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value={'card'}
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className='mr-2'
                />
                Card
              </label>

              <label className='flex items-center'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value={'cod'}
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className='mr-2'
                />
                Cash on Delivery
              </label>

              <label className='flex items-center'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value={'mpesa'}
                  checked={paymentMethod === 'mpesa'}
                  onChange={() => setPaymentMethod('mpesa')}
                  className='mr-2'
                />
                Mpesa
              </label>
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
          {cartItems.map((item) => (
            <div key={item.id} className='flex justify-between mb-4'>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span> ${(item.price * item.quantity).toFixed(2)} </span>
            </div>
          ))}

          <hr className='my-3' />

          <p className='text-gray-700'>
            Total Price:{' '}
            <span className='font-bold'> ${totalPrice.toFixed(2)} </span>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useDispatch } from 'react-redux'
import { useFetchCartQuery } from '../redux/cartApi'

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Fetch cart data only if user is logged in
  const { data: cartData } = useFetchCartQuery(undefined, {
    skip: !user, // Prevents fetching when user is not logged in
  })

  useEffect(() => {
    if (cartData) {
      dispatch({ type: 'cart/fetchCart/fulfilled', payload: cartData })
    }
  }, [cartData, dispatch])

  const handleLogout = async () => {
    logout()
    navigate('/')
  }

  return (
    <nav className='bg-blue-600 text-white shadow-md flex items-center justify-between p-4 border-b-1'>
      <Link
        to={'/'}
        className='text-2xl font-bold tracking-wide hover:text-gray-300'>
        LifeEasy
      </Link>

      <div className='space-x-4 flex items-center'>
        <Link to={'/'} className='mx-3 text-lg hover:text-gray-300'>
          Home
        </Link>

        {user?.role === 'user' && (
          <Link to={'/orders'} className='hover:text-gray-300'>
            My Orders
          </Link>
        )}
        {user?.role === 'seller' && (
          <>
            <Link
              to={'/seller/manage-products'}
              className='hover:text-gray-300'>
              Manage Products
            </Link>
            <Link to={'/seller/manage-orders'} className='hover:text-gray-300'>
              Orders
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to={'/admin/manage-users'} className='hover:text-gray-300'>
              Manage Users
            </Link>
            <Link to={'/admin/manage-orders'} className='hover:text-gray-300'>
              Manage Orders
            </Link>
          </>
        )}

        {user && (
          <Link to={'/cart'} className='relative hover:text-gray-300'>
            Cart
            {cartData?.items.length > 0 && (
              <span className='absolute bottom-3 right-0 bg-red-500 px-2 py-0.5 rounded-full text-xs'>
                {cartData.items.length}
              </span>
            )}
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to={'/login'}
              className='bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200'>
              Login
            </Link>
            <Link
              to={'/register'}
              className='bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200'>
              Register
            </Link>
          </>
        ) : (
          <button
            className='bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700'
            onClick={handleLogout}>
            Logout ({user.username})
          </button>
        )}
      </div>
    </nav>
  )
}

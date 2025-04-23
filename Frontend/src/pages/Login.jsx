import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const { login, authLoading } = useContext(AuthContext)

  const navigate = useNavigate()

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission (Placeholder for now)
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      navigate('/') // Redirect to home after login
    } catch (err) {
      setError(err.message || 'Invalid Credentials. Please try again')
    }
  }

  return (
    <div className='container mx-auto p-6 max-w-md'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Login</h1>
      <form
        onSubmit={handleLogin}
        className='bg-white p-6 rounded-lg shadow-md'>
        <input
          type='email'
          name='email'
          placeholder='Email'
          className='w-full p-3 border rounded mb-3'
          required
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type='password'
          name='password'
          placeholder='Password'
          className='w-full p-3 border rounded mb-3'
          required
          value={formData.password}
          onChange={handleChange}
        />

        {error && <span className='text-red-600 text-sm'>{error}</span>}

        <button
          type='submit'
          disabled={authLoading}
          className='w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          {authLoading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <p className='mt-4 text-center text-gray-600'>
        Don&apos;t have an account?
        <Link to='/register' className='text-blue-600'>
          Register
        </Link>
      </p>
    </div>
  )
}

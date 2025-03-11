import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Register = () => {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  // Store form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role is 'user'
  })

  // State to handle errors
  const [error, setError] = useState('')

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await register(
        formData
      ) // use this because our registerMutation expects an object
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className='container mx-auto p-6 max-w-md'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Register</h1>

      <form
        onSubmit={handleRegister}
        className='bg-white p-6 rounded-lg shadow-md'>
        <input
          type='text'
          name='username'
          placeholder='Username'
          className='w-full p-3 border rounded mb-3'
          required
          value={formData.username}
          onChange={handleChange}
        />

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

        <label className='block mb-3'>
          <span className='text-gray-700'>Role:</span>
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            className='w-full p-2 border rounded mt-1'>
            <option value='user'>User</option>
            <option value='seller'>Seller</option>
          </select>
        </label>

        {/* Show error message if registration fails */}
        {error && <p className='text-red-500 text-center mb-3'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Register
        </button>
      </form>

      <p className='mt-4 text-center text-gray-600'>
        Already have an account?
        <Link to='/login' className='text-blue-600 ml-1'>
          Login
        </Link>
      </p>
    </div>
  )
}

import { createContext, useEffect, useState } from 'react'
import { useLoginMutation, useRegisterMutation } from '../redux/authApi'

//Create the authentication context
export const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  //Variable to store user state
  const [user, setUser] = useState(null)

  const [registerUser] = useRegisterMutation()
  const [loginUser] = useLoginMutation()

  //Action to fetch user data from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  //Function to login user - (Action to set user data to local storage)
  const login = async (email, password) => {
    try {
      const { data } = await loginUser({ email, password })

      if (data) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        setUser(data.user)
      }
    } catch (error) {
      console.error('Login failed', error.message)
    }
  }

  //Function to register user
  const register = async (formData) => {
    try {
      const { data } = await registerUser(formData)

      if (data) {
        await loginUser(formData.email, formData.password)
      }
    } catch (error) {
      console.error('Registration failed', error.message)
    }
  }

  //Function to signout user
  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

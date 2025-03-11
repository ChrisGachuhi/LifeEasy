import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Cart } from './pages/Cart'
import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import { Register } from './pages/Register'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProductDetails } from './pages/ProductDetails'
import { Orders } from './pages/Orders'
import { ManageProducts } from './pages/ManageProducts'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminOrders } from './pages/AdminOrders'
import { AdminUsers } from './pages/AdminUsers'
import { SellerDashboard } from './pages/SellerDashboard'
import { ManageOrders } from './pages/ManageOrders'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

function App() {
  // Get user authentication state
  const { user } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <Navbar />
      <main className='bg-gray-100 min-h-screen p-4'>
        <Routes>
          {/* Public Routes (Accessible to Everyone) */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/product/:id' element={<ProductDetails />} />

          {/* Protected Routes (Require Authentication) */}
          {user && (
            <>
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/orders' element={<Orders />} />
            </>
          )}

          {/* Seller Routes (Require Seller Role) */}
          {user?.role === 'seller' && (
            <>
              <Route path='/seller/dashboard' element={<SellerDashboard />} />
              <Route
                path='/seller/manage-products'
                element={<ManageProducts />}
              />
              <Route path='/seller/manage-orders' element={<ManageOrders />} />
            </>
          )}

          {/* Admin Routes (Require Admin Role) */}
          {user?.role === 'admin' && (
            <>
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/manage-users' element={<AdminUsers />} />
              <Route path='/admin/manage-orders' element={<AdminOrders />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App

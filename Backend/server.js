const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Existing route imports
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

// NEW: Import cart routes for persistence
const cartRoutes = require('./routes/cart')

// Middleware
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/cart', cartRoutes) // NEW: Attach cart endpoints


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err))

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

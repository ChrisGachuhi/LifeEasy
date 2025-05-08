require('dotenv').config() // Load environment variables
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/order')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const mpesaRoutes = require('./routes/mpesa') // Import MPesa routes

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/mpesa', mpesaRoutes) // Mount MPesa routes

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Server Start
const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)

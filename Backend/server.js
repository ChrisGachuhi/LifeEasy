require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

//Socket.io setup
const { createServer } = require('http')
const { Server } = require('socket.io')
const socketManager = require('./socketManager')

const server = createServer(app) //Create HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

//Route handlers
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

//Middleware
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads')) // serve static files

app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Connection error', err))

//Handle real-time connections
socketManager(io)

//Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Connected on PORT ${PORT}`))

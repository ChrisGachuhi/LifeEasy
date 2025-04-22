const express = require('express')
const router = express.Router()

const Order = require('../models/Order')
const Product = require('../models/Product')
const authenticateToken = require('../middlewares/authenticateToken')
const authorizeRole = require('../middlewares/authorizeRole')

//Place a new order - (User)
router.post('/', authenticateToken, async (req, res) => {
  const { products } = req.body //attached the array of product&quantity to the body of the request

  try {
    let totalAmount = 0
    const validatedProducts = []

    //Loop through the list of products in db, run all necessary computations
    for (const item of products) {
      const product = await Product.findById(item.products)

      if (!product)
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` })

      if (product.quantity < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` })

      totalAmount += product.price * item.quantity
      validatedProducts.push({ product: product._id, quantity: item.quantity })

      product.stock -= item.quantity
      await product.save()
    }

    //create order and update db
    const order = new Order({
      user: req.user.id,
      products: validatedProducts,
      totalAmount,
    })

    await order.save()
    res.status(201).json({ message: 'Order placed successfully', order })
  } catch (err) {
    console.error('Order placement failed', err)
    res.status(500).json({ message: 'Error placing order', error: err.message })
  }
})

//Fetch the orders based on user role
router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders

    if (req.user.role === 'user')
      orders = await Order.find({ user: req.user.id }).populate(
        'products.product',
        'name price'
      )
    else if (req.user.role === 'seller') {
      //fetch all the orders from db
      orders = await Order.find()
        .populate('products.product', 'name price seller')
        .populate('user', 'username email')

      //filter out all orders containing their products
      orders = orders.filter((order) =>
        order.products.some((p) => p.product.seller.toString() === req.user.id)
      )
    } else if (req.user.role === 'admin') {
      //fetch all orders from the db
      orders = await Order.find()
        .populate('products.product', 'name price')
        .populate('user', 'username email')
    } else {
      return res.status(403).json({ message: 'Access Denied' })
    }

    res.json(orders)
  } catch (err) {
    console.error('Error fetching orders', err)
    res
      .status(500)
      .json({ message: 'Error fetching orders', error: err.message })
  }
})

//Update order status -for admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    const { status } = req.body

    try {
      const order = await Order.findById(req.params.id)

      if (!order) return res.status(404).json({ message: 'Order not found' })

      order.status = status
      await order.save()

      res.json({ message: 'Order status updated' })
    } catch (err) {
      console.error('Failed to update order status', err)
      res
        .status(500)
        .json({ message: 'Error updating the order', error: err.message })
    }
  }
)

module.exports = router
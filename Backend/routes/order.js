const express = require('express')
const router = express.Router()

const Order = require('../models/Order')
const Product = require('../models/Product')
const authenticateToken = require('../middlewares/authenticateToken')
const authorizeRole = require('../middlewares/authorizeRole')

// ========== PLACE NEW ORDER ==========
router.post('/', authenticateToken, async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body

  try {
    let totalAmount = 0
    const validatedProducts = []

    for (const item of products) {
      // Validate product exists
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product} not found`,
        })
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        })
      }

      // Calculate total price
      totalAmount += product.price * item.quantity

      // Prepare for order
      validatedProducts.push({
        product: product._id,
        quantity: item.quantity,
      })

      // Decrease stock
      product.stock -= item.quantity
      await product.save()
    }

    const order = new Order({
      user: req.user.id,
      products: validatedProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
    })

    await order.save()

    res.status(201).json({ message: 'Order placed successfully', order })
  } catch (err) {
    console.error('Order placement failed:', err)
    res.status(500).json({
      message: 'Error placing order',
      error: err.message,
    })
  }
})

// ========== FETCH ORDERS (ROLE-BASED) ==========
router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders

    if (req.user.role === 'user') {
      // Users get only their own orders
      orders = await Order.find({ user: req.user.id })
        .populate('products.product', 'name price')
        .populate('user', 'username email')
    } else if (req.user.role === 'seller') {
      // Fetch all, then filter to seller’s products
      orders = await Order.find()
        .populate('products.product', 'name price seller')
        .populate('user', 'username email')

      orders = orders.filter((order) =>
        order.products.some(
          (p) => p.product?.seller?.toString() === req.user.id
        )
      )
    } else if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('products.product', 'name price')
        .populate('user', 'username email')
    } else {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(orders)
  } catch (err) {
    console.error('Error fetching orders:', err)
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message })
  }
})

// ========== UPDATE ORDER STATUS ==========
router.put('/:id', authenticateToken, authorizeRole(['admin', 'seller']), async (req, res) => {
  const { status } = req.body

  try {
    const order = await Order.findById(req.params.id).populate('products.product')

    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Sellers: Only update if their product exists in order
    if (req.user.role === 'seller') {
      const isSellerOrder = order.products.some(
        (item) => item.product?.seller?.toString() === req.user.id
      )

      if (!isSellerOrder)
        return res
          .status(403)
          .json({ message: 'You can only update orders for your products' })
    }

    order.status = status
    await order.save()

    res.json({ message: 'Order status updated', order })
  } catch (err) {
    console.error('Failed to update order status:', err)
    res.status(500).json({ message: 'Failed to update order', error: err.message })
  }
})

module.exports = router
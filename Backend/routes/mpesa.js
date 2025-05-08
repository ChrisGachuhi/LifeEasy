const express = require('express')
const router = express.Router()
const { initiateStkPush } = require('../mpesa/mpesaSTK')
const authenticateToken = require('../middlewares/authenticateToken')
const Order = require('../models/Order')
const Product = require('../models/Product')

// POST /api/mpesa/stkpush
router.post('/stkpush', authenticateToken, async (req, res) => {
  const {
    phoneNumber,
    products = [],
    shippingAddress,
    transactionDesc,
  } = req.body

  // Debug what's in the req.user object
  console.log('Auth token payload:', req.user)

  // Get the appropriate user identifier from the token
  // This is the quick fix - use whatever ID property your token contains
  const userId = req.user.userId || req.user.id || req.user._id

  if (!userId) {
    return res.status(401).json({
      error:
        'User ID not found in authentication token. Check console logs for token structure.',
    })
  }

  if (
    !phoneNumber ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !shippingAddress
  ) {
    return res
      .status(400)
      .json({ error: 'Missing required parameters for M-PESA payment.' })
  }

  try {
    let totalAmount = 0
    const validatedProducts = []

    for (const item of products) {
      if (!item.product || !item.quantity || isNaN(item.quantity)) {
        return res.status(400).json({ error: 'Invalid product format.' })
      }

      const productFromDb = await Product.findById(item.product)
      if (!productFromDb) {
        return res
          .status(404)
          .json({ error: `Product ${item.product} not found.` })
      }

      validatedProducts.push({
        product: productFromDb._id,
        quantity: Number(item.quantity),
      })

      totalAmount += productFromDb.price * Number(item.quantity)
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount.' })
    }

    // Create the order with the user ID and fixed lowercase payment status
    const newOrder = new Order({
      user: userId,
      products: validatedProducts,
      totalAmount,
      shippingAddress,
      paymentMethod: 'mpesa',
      status: 'Pending', // This is fine as the enum for status has capitalized values
      paymentStatus: 'pending', // Fixed to lowercase to match enum
    })

    const savedOrder = await newOrder.save()

    const response = await initiateStkPush(
      phoneNumber,
      totalAmount,
      transactionDesc || `Payment for Order ${savedOrder._id}`
    )

    res.status(200).json({
      message: 'STK Push initiated',
      orderId: savedOrder._id,
      response,
    })
  } catch (error) {
    console.error('STK Push Error:', error)
    res.status(500).json({
      error: error.message || 'Failed to process M-PESA STK Push.',
    })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const authenticateToken = require('../middlewares/authenticateToken')
const Cart = require('../models/Cart')

// Get User's Cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    )

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
      await cart.save()
    }

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message })
  }
})

// Add or Update Item in Cart
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body

  try {
    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message })
  }
})

router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body
    const userId = req.user.id // Extract user ID from token

    const userCart = await Cart.findOne({ user: userId })

    if (!userCart) return res.status(404).json({ message: 'Cart not found' })

    userCart.items = items
    await userCart.save()

    res.json({ message: 'Cart updated', cart: userCart })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


// Remove Item from Cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    )

    await cart.save()
    res.status(200).json(cart)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error removing item from cart', error: err.message })
  }
})

// Clear Cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = []
    await cart.save()
    res.status(200).json({ message: 'Cart cleared' })
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message })
  }
})

module.exports = router

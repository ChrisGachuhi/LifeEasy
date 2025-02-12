const express = require('express')
const Order = require('../models/Order')
const Product = require('../models/Product')
const authenticateToken = require('../middlewares/authenticateToken')
const authorizeRole = require('../middlewares/authorizeRole')
const router = express.Router()

const { notifyAdmins, notifyUser } = require('../socketManager')

//Place a new order - [Authenticated Users Only]
router.post('/', authenticateToken, async (req, res) => {
  const { products } = req.body //array of product ids and quantities - because an order can contain more then one product

  try {
    let totalAmount = 0
    let sellerToNotify = new Set() //store unique sellerId to avoid duplicate notifications
    let productDetails = [] //store product,seller,price details for admin notification

    //VALIDATE AND CALCULATE TOTAL AMOUNT
    for (const item of products) {
      const product = await Product.findById(item.product)

      //if the product doesnt exists
      if (!product)
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` })

      //if the inventory level is less than the order amount
      if (product.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name} ` })

      //calculate the order total
      totalAmount += product.price * item.quantity

      //add seller id to the set
      sellerToNotify.add(product.seller._id.toString())

      //store product details
      productDetails.push({
        name: product.name,
        price: product.price,
        seller: {
          id: product.seller._id,
          username: product.seller.username,
          email: product.seller.email,
        },
      })

      //CREATE THE ORDER
      const order = new Order({
        user: req.user.id, //attach user id from the TOKEN
        product,
        totalAmount,
      })

      //REDUCE THE STOCK FOR EACH PRODUCT
      for (item of products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        })
      }

      await order.save()

      //Notify seller
      sellerToNotify.forEach((sellerId) => {
        notifyUser(req.app.get('io'), sellerId, 'newOrder', {
          message: 'You have a new order',
        })
      })

      //Notify admin
      notifyAdmins(req.app.get('io'), 'newOrder', {
        message: 'A new order has been placed',
        orderId: order._id,
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
        },
        product: productDetails,
      })

      res.status(201).json({ message: 'Order placed successfully', order })
    }
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message })
  }
})

//Fetch orders - [Needs Role-Based Access]
router.get('/', authenticateToken, async (req, res) => {
  try {
    let orders

    //Users can fetch their own orders
    if (req.user.role === 'user')
      orders = await Order.find({ user: req.user.id }).populate(
        'products.product',
        'name price'
      )
    //Sellers fetch orders that contain their products
    else if (req.user.role === 'seller') {
      orders = await orders
        .find()
        .populate('products.product', 'name price seller')
        .populate('user', 'username email')

      orders = orders.filter((order) =>
        order.products.some(
          (item) => item.product.seller.toString() === req.user.id
        )
      )
    }

    //Admin fetch all orders
    else if (req.user.role === 'admin')
      orders = await Order.find()
        .populate('products.product', 'name price')
        .populate('user', 'username email')
    //Unauthorized deny access to orders
    else res.status(403).json({ message: 'Access Denied' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching order', error: err.message })
  }
})

//Update Order Status
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    const { status } = req.body

    try {
      const order = await Order.findById(req.params.id)

      if (!order) res.status(404).json({ message: 'Order not found' })

      order.status = status
      await order.save()

      res.json({ message: 'Order updated successfully' })
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error updating order', error: err.message })
    }
  }
)

module.exports = router

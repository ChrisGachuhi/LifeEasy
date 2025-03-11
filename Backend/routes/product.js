const express = require('express')
const Product = require('../models/Product')
const router = express.Router()

const multer = require('multer')
const authenticateToken = require('../middlewares/authenticateToken')
const authorizeRole = require('../middlewares/authorizeRole')

//
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
})

const upload = multer({ storage })

//Add new product - [Seller / Admin Only]
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'seller']),
  upload.single('image'),
  async (req, res) => {
    const { name, description, price, category, stock } = req.body

    try {
      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        image: `uploads/${req.file.filename}`, //Save the file path for the image
        owner: req.user.id, //Tie the product to the seller
      })

      await product.save()
      res.status(201).json({ message: 'Product created successfully', product })
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error creating product', error: err.message })
    }
  }
)

//Update products - only admin & seller can update their own products
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'seller']),
  upload.single('image'), // Allow image upload for update
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      if (
        req.user.role === 'seller' &&
        req.user.id !== product.owner.toString()
      ) {
        return res.status(403).json({ message: 'You do not own this product' })
      }

      // Update fields
      product.name = req.body.name || product.name
      product.description = req.body.description || product.description
      product.price = req.body.price || product.price
      product.category = req.body.category || product.category
      product.stock = req.body.stock || product.stock

      // Update image if a new one is provided
      if (req.file) {
        product.image = `/uploads/${req.file.filename}`
      }

      await product.save()
      res.status(200).json({ message: 'Product updated successfully', product })
    } catch (err) {
      console.error('Error updating product:', err)
      res.status(500).json({ message: 'Error updating the product' })
    }
  }
)

//Delete products - only admin & seller can delete their own products
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['seller', 'admin']),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      if (!product)
        return res.status(404).json({ message: 'Product not found' })

      if (
        req.user.role === 'seller' &&
        req.user.id !== product.owner.toString()
      )
        return res.status(403).json({ message: 'You do not own this product' })

      await Product.findByIdAndDelete(req.params.id)
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error deleting product', error: err.message })
    }
  }
)

//Fetch all products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query

    //Build query filters dynamically
    const filters = {}

    if (category) filters.category = category
    if (minPrice) filters.price = { $gte: Number(minPrice) }
    if (maxPrice) filters.price = { ...filters.price, $gte: Number(maxPrice) }
    if (search) filters.name = new RegExp(search, 'i')

    const products = await Product.find(filters)
    res.json(products)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching products', error: err.message })
  }
})

//Fetch product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) res.status(400).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching product', error: err.message })
  }
})

module.exports = router

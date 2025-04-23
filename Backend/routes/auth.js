const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()
const authorizeRole = require('../middlewares/authorizeRole')
const authenticateToken = require('../middlewares/authenticateToken')

// Fetch all users (Admin only)
router.get(
  '/users',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const users = await User.find().select('-password')
      res.json(users)
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error fetching users', error: err.message })
    }
  }
)

// Register new user
router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'user' : role, // prevent registering as admin
    })

    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error registering user', error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid password' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.status(200).json({ message: 'Login successful', token, user })
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message })
  }
})

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logout successful' })
})

// Update Role (admin-only)
router.put(
  '/users/:id/role',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    const { role } = req.body
    const validRoles = ['admin', 'user', 'seller']

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password')
      if (!user) return res.status(404).json({ message: 'User not found' })

      res.json({ message: 'User role updated', user })
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error updating role', error: err.message })
    }
  }
)

// Delete User (admin-only)
router.delete(
  '/users/:id',
  authenticateToken,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) return res.status(404).json({ message: 'User not found' })

      if (user.role === 'admin') {
        return res.status(403).json({ message: 'Cannot delete admin users' })
      }

      await user.deleteOne()
      res.json({ message: 'User deleted successfully' })
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error deleting user', error: err.message })
    }
  }
)

module.exports = router

// models/Order.js
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Linked to the User who placed the order
    ref: 'User',
    required: true,
  },

  // Array of products in the order
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // Each product's ID
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number, // Quantity of that product
        required: true,
        min: 1,
      },
    },
  ],

  totalAmount: {
    type: Number, // Calculated on server before saving
    required: true,
  },

  // NEW: Shipping Information for delivery
  shippingAddress: {
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  // NEW: Payment method selected by user
  paymentMethod: {
    type: String,
    enum: ['card', 'cod', 'mpesa'],
    required: true,
  },

  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'], // Admin or seller can update this
    default: 'Pending',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Order', orderSchema)

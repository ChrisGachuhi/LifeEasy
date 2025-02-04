const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //the user who placed the order

  product: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      }, //the product that has been ordered
      quantity: { type: Number, required: true },
    },
  ],

  totalAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },

  createdAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Order', orderSchema)

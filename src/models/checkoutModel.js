const mongoose = require('mongoose')
const schema = mongoose.Schema
const checkoutSchema = new schema({
  firstname: { type: String },
  lastname: { type: String },
  address: { type: String },
  postcode: { type: String },
  phone: { type: String },
  email: { type: String },
  ordernotes: { type: String },
  event: { type: String },
  theme: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },

})
const checkoutModel = mongoose.model('checkout_tb', checkoutSchema)
module.exports = checkoutModel
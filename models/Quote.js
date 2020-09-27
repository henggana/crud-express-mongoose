const mongoose = require('mongoose')
const Schema = mongoose.Schema
const quoteSchema = new Schema({
  name: String,
  quote: String,
})

module.exports = mongoose.model('Quote', quoteSchema)

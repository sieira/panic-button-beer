'use strict';

// TODO numeral lib will be used to convert between currency and Number for the price
var mongoose = require('mongoose');

// Define our beer schema
var BeerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  img: {
    data: Buffer,
    content-type: String
  },
  description: String,
  price: Number,
  new: Boolean,
  visible: true,
  // Weight for probability
  weight: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);

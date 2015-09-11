'use strict';

// TODO numeral lib will be used to convert between currency and Number for the price
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define our beer schema
var BeerSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  img: { type: Schema.Types.ObjectId, ref: 'BeerImage', unique: true },
  description: String,
  price: Number,
  new: { type: Boolean, default: true },
  visible: { type: Boolean, default: false },
  // Weight for probability
  weight: { type: Number, default: 1 }
});

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);

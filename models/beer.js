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
  brewery: String, //This could be an independent entity
  img: { type: Schema.Types.ObjectId, ref: 'BeerImage', unique: true },
  description: String,
  kind: String,
  alcohol: Number,
  price: Number,
  visible: { type: Boolean, default: false },
  weight: { type: Number, default: 1 }, // Weight for probability
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: undefined }
});

BeerSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);

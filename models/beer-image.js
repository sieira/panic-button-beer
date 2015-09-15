'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeerImageSchema = new Schema({
  img: {
    data: Buffer,
    contentType: { type: String, default: 'image/*' }
  },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: undefined }
});

BeerImageSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });

// Export the Mongoose model
module.exports = mongoose.model('BeerImage', BeerImageSchema);

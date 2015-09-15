'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeerImageSchema = new Schema({
  /*
    TODO
     There should be a reference to the beer, so it becomes a one-to-one rel
     as it is, you can use the same image for several different beers
     beer: { type: Schema.Types.ObjectId, ref: 'Beer', unique: true },
  */
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

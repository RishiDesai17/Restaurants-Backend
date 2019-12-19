const mongoose = require('mongoose');

const menuItemsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  restaurantId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  veg: {
    type: String,
    required: true
  },
  jain_option: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('MenuItem', menuItemsSchema);

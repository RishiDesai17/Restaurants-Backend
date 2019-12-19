const mongoose = require('mongoose');

const restaurantsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  menu: Object
});

module.exports = mongoose.model('Restaurant', restaurantsSchema);

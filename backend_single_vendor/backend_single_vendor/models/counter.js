const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Identifier for the counter
  seq: { type: Number, required: true }, // Sequence number
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;

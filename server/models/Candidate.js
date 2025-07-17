const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile: { type: String },
  image: { type: String },
});

module.exports = mongoose.model('Candidate', candidateSchema);

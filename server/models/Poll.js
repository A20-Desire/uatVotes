const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  resultVisible: { type: Boolean, default: false },
});

module.exports = mongoose.model('Poll', pollSchema);

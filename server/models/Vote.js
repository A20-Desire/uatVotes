const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
  paid: { type: Boolean, default: false },
});

module.exports = mongoose.model('Vote', voteSchema);

const router = require('express').Router();
const Vote = require('../models/Vote');
const Poll = require('../models/Poll');
const auth = require('../middleware/auth');

router.post('/', auth(), async (req, res) => {
  try {
    const poll = await Poll.findById(req.body.poll);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    const vote = await Vote.create({
      user: req.user.id,
      poll: req.body.poll,
      candidate: req.body.candidate,
      quantity: req.body.quantity || 1,
    });
    res.json(vote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/poll/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll.resultVisible) return res.status(403).json({ message: 'Results hidden' });
  const votes = await Vote.find({ poll: req.params.id, paid: true }).populate('candidate');
  const results = {};
  votes.forEach(v => {
    const id = v.candidate._id.toString();
    if (!results[id]) results[id] = { candidate: v.candidate, votes: 0 };
    results[id].votes += v.quantity;
  });
  res.json(Object.values(results));
});

router.get('/poll/:id/admin', auth(true), async (req, res) => {
  const votes = await Vote.find({ poll: req.params.id, paid: true }).populate('candidate');
  const results = {};
  votes.forEach(v => {
    const id = v.candidate._id.toString();
    if (!results[id]) results[id] = { candidate: v.candidate, votes: 0 };
    results[id].votes += v.quantity;
  });
  res.json(Object.values(results));
});

module.exports = router;

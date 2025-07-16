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
    });
    res.json(vote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/poll/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll.resultVisible) return res.status(403).json({ message: 'Results hidden' });
  const votes = await Vote.find({ poll: req.params.id }).populate('candidate');
  res.json(votes);
});

module.exports = router;

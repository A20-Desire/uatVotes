const router = require('express').Router();
const Poll = require('../models/Poll');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const polls = await Poll.find().populate('candidates');
  res.json(polls);
});

router.post('/', auth(true), async (req, res) => {
  try {
    const candidates = await Candidate.insertMany(req.body.candidates || []);
    const poll = await Poll.create({
      title: req.body.title,
      candidates: candidates.map(c => c._id),
    });
    res.json(await poll.populate('candidates'));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/toggle', auth(true), async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    poll.resultVisible = !poll.resultVisible;
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

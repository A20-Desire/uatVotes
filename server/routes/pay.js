const router = require('express').Router();
const axios = require('axios');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_CALLBACK = process.env.PAYSTACK_CALLBACK;

router.post('/', auth(), async (req, res) => {
  try {
    const { email, voteId, quantity } = req.body;
    const vote = await Vote.findById(voteId);
    if (!vote) return res.status(404).json({ message: 'Vote not found' });

    vote.quantity = quantity || 1;
    await vote.save();

    const response = await axios.post('https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: (quantity || 1) * 10000, // 100 Naira per vote in kobo
        callback_url: PAYSTACK_CALLBACK,
        metadata: { voteId },
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { reference, voteId } = req.body;
    const verify = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
    if (verify.data.data.status === 'success') {
      const vote = await Vote.findById(voteId);
      if (vote) {
        vote.paid = true;
        await vote.save();
      }
    }
    res.json(verify.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Address } = require('../models');
const {authenticate,authorize} = require('../middlewares/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json({ addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { label, line1, line2, city, state, country, postalCode } = req.body;
    const newAddress = await Address.create({
      userId: req.user.id,
      label,
      line1,
      line2,
      city,
      state,
      country,
      postalCode,
    });
    res.status(201).json({ address: newAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });

    await address.update(req.body);
    res.json({ address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });

    await address.destroy();
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

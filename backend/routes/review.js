// POST /api/bookings/:id/review
const express = require('express');
const router = express.Router();

const { Booking, Service, Address, Users } = require('../models');
const {authenticate,authorize} = require('../middlewares/auth'); 

router.post("/:id/review", authenticate, async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  const userId = req.user.id;

  try {
    const booking = await Booking.findOne({ where: { id, userId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status.toLowerCase() !== "serviced") {
      return res.status(400).json({ message: "You can only review serviced bookings" });
    }

    booking.review = review;
    await booking.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
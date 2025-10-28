const express = require('express');
const router = express.Router();
const { Booking, Service, Address } = require('../models');
const {authenticate, authorize} = require('../middlewares/auth'); 
const {
  getPendingBookingsForHelper,
  confirmBooking,
} = require("../controllers/bookingController");


router.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { services, addressId } = req.body; 

  if (!addressId) {
    return res.status(400).json({ message: 'Address ID is required' });
  }

  try {
    const serviceList = Array.isArray(services) ? services : [services];

    const bookings = await Promise.all(
      serviceList.map(async (s) =>
        Booking.create({
          userId,
          serviceId: s.serviceId || s.id, 
          addressId,
          status: 'pending',
        })
      )
    );

    res.status(201).json({ message: 'Booking(s) confirmed successfully', bookings });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Service, as: "service" },
        { model: Address, as: "address" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const booking = await Booking.findOne({ where: { id, userId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status.toLowerCase() !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/helpers/:helperId/bookings/pending", getPendingBookingsForHelper);
router.put("/:bookingId/confirm", confirmBooking);



module.exports = router;

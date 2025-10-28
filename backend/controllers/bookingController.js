const { Booking, Service, PartnerRequest, User } = require("../models");
const { Op } = require("sequelize");

exports.getPendingBookingsForHelper = async (req, res) => {
  try {
    const { helperId } = req.params;

    // Step 1: Get helper's email
    const helper = await User.findByPk(helperId);
    if (!helper) return res.status(404).json({ message: "Helper not found" });

    // Step 2: Get categoryId from PartnerRequest using helper's email
    const partnerRequest = await PartnerRequest.findOne({
      where: { email: helper.email },
    });

    if (!partnerRequest)
      return res.status(404).json({ message: "PartnerRequest not found for this helper" });

    const categoryId = partnerRequest.categoryId;

    // Step 3: Fetch pending bookings of that category
    const bookings = await Booking.findAll({
      where: { status: "pending" },
      include: [
        {
          model: Service,
          as: "service",
          where: { categoryId },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching pending bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "pending")
      return res.status(400).json({ message: "Booking already processed" });

    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Booking confirmed successfully" });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};


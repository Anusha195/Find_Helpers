const express = require("express");
const router = express.Router();
const { Cart, Service } = require("../models");
const {authenticate, authorize} = require("../middlewares/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const items = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Service, attributes: ["id", "title", "price"] }],
    });
    res.json(items);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.post("/add", authenticate, async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user.id;

    let item = await Cart.findOne({ where: { userId, serviceId } });
    if (item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = await Cart.create({ userId, serviceId, quantity: 1 });
    }

    res.json({ message: "Added to cart successfully" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/remove", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    await Cart.destroy({ where: { id } });
    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

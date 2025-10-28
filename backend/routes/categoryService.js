const express = require("express");
const router = express.Router();
const { Category, Service, City, ServiceCity } = require("../models");

router.get("/category/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ where: { slug } });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const services = await Service.findAll({
      where: { categoryId: category.id },
      include: [
        {
          model: City,
          as: "cities", 
          attributes: ["name"],
          through: { model: ServiceCity, attributes: [] },
        },
      ],
    });

    console.log("=== RAW SERVICES ===");
    console.log(JSON.stringify(services, null, 2));
    const formatted = services.map((s) => ({
      id: s.id,
      name: s.title,
      description: s.description,
      price: s.price,
      cities: s.cities.map((c) => c.name),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

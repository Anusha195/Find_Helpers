const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      attributes: ["id", "name", "slug"]
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:slug/services", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await db.Category.findOne({ where: { slug } });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const services = await db.Service.findAll({
      where: { categoryId: category.id },
      limit: 6,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "description", "price"]
    });

    res.json({ category, services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/categories-with-services", async (req, res) => {
  try {
    const { search, minPrice, maxPrice, cityId } = req.query;

    const categories = await db.Category.findAll({
      where: search ? { name: { [Op.like]: `%${search}%` } } : {},
      order: [["name", "ASC"]],
    });

    const categoriesWithServices = await Promise.all(
      categories.map(async (cat) => {
        let whereClause = { categoryId: cat.id, active: true };

        if (minPrice || maxPrice) {
          whereClause.price = {};
          if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
          if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        const includeCity = cityId
          ? [
              {
                model: db.City,
                as: "cities",
                where: { id: cityId },
                attributes: ["id", "name"],
                through: { attributes: [] },
                required: true,
              },
            ]
          : [
              {
                model: db.City,
                as: "cities",
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ];

        const services = await db.Service.findAll({
          where: whereClause,
          include: includeCity,
          order: [["createdAt", "DESC"]],
          limit: 6,
        });

        const formattedServices = services.map((s) => ({
          id: s.id,
          title: s.title, 
          description: s.description,
          price: s.price,
          cities: s.cities?.map((c) => c.name) || [],
        }));

        return { ...cat.dataValues, services: formattedServices };
      })
    );

    const filtered = categoriesWithServices.filter(
      (cat) => cat.services.length > 0 || search
    );

    filtered.sort((a, b) => (b.services?.length || 0) - (a.services?.length || 0));

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const { PartnerRequest, Category, Service, City, ServiceCity, sequelize } = require('../models');

const adminController = {
  async listPartnerRequests(req, res) {
    try {
      const requests = await PartnerRequest.findAll({
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category' }],
      });
      res.json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to load partner requests' });
    }
  },

  async getPartnerRequest(req, res) {
    try {
      const request = await PartnerRequest.findByPk(req.params.id, {
        include: [{ model: Category, as: 'category' }],
      });
      if (!request) return res.status(404).json({ message: 'Not found' });
      res.json(request);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch request' });
    }
  },

  async approvePartnerRequest(req, res) {
    try {
      const request = await PartnerRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Not found' });
      request.status = 'approved';
      await request.save();
      res.json({ message: 'Partner request approved', request });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to approve request' });
    }
  },

  async rejectPartnerRequest(req, res) {
    try {
      const request = await PartnerRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Not found' });
      request.status = 'rejected';
      await request.save();
      res.json({ message: 'Partner request rejected', request });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to reject request' });
    }
  },

  async listCategories(req, res) {
    try {
      const cats = await Category.findAll({ order: [['id', 'ASC']] });
      res.json(cats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  },

  async getCategory(req, res) {
    try {
      const cat = await Category.findByPk(req.params.id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      res.json(cat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch category' });
    }
  },

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
      const category = await Category.create({ name, slug });
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create category' });
    }
  },

  async updateCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
      await category.update({ name, slug });
      res.json({ message: 'Category updated', category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update category' });
    }
  },

  async deleteCategory(req, res) {
    try {
      const deleted = await Category.destroy({ where: { id: req.params.id }});
      if (!deleted) return res.status(404).json({ message: 'Category not found' });
      res.json({ message: 'Category deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete category' });
    }
  },

  async listServices(req, res) {
    try {
      const services = await Service.findAll({
        include: [{ model: Category, as: 'category' }],
        order: [['id', 'ASC']],
      });
      res.json(services);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  },

  async getService(req, res) {
    try {
      const service = await Service.findByPk(req.params.id, {
        include: [
          { model: Category, as: 'category' },
          { model: ServiceCity, as: 'serviceCities', include: [{ model: City, as: 'city' }] }
        ]
      });
      if (!service) return res.status(404).json({ message: 'Service not found' });
      res.json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch service' });
    }
  },

  async createService(req, res) {
    try {
      const { title, price, categoryId } = req.body;
      if (!title) return res.status(400).json({ message: 'Title required' });
      const service = await Service.create({ title, price, categoryId });
      res.status(201).json(service);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create service' });
    }
  },

  async updateService(req, res) {
    try {
      const { title, price, categoryId } = req.body;
      const service = await Service.findByPk(req.params.id);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      await service.update({ title, price, categoryId });
      res.json({ message: 'Service updated', service });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update service' });
    }
  },

  async deleteService(req, res) {
    try {
      const deleted = await Service.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ message: 'Service not found' });
      res.json({ message: 'Service deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete service' });
    }
  },

  async listCities(req, res) {
    try {
      const cities = await City.findAll({ order: [['name', 'ASC']] });
      res.json(cities);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch cities' });
    }
  },

  async createCity(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ message: 'Name required' });
      const city = await City.create({ name });
      res.status(201).json(city);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create city' });
    }
  },

  async deleteCity(req, res) {
    try {
      const deleted = await City.destroy({ where: { id: req.params.id }});
      if (!deleted) return res.status(404).json({ message: 'City not found' });
      res.json({ message: 'City deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete city' });
    }
  },

  async getServiceCities(req, res) {
    try {
      const serviceId = req.params.id;
      const rows = await ServiceCity.findAll({
        where: { serviceId },
        include: [{ model: City, as: 'city' }]
      });
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch service cities' });
    }
  },

  async assignServiceCities(req, res) {
    const t = await sequelize.transaction();
    try {
      const serviceId = req.params.id;
      const { cityIds } = req.body;

      if (!Array.isArray(cityIds)) {
        await t.rollback();
        return res.status(400).json({ message: 'cityIds must be an array' });
      }

      await ServiceCity.destroy({ where: { serviceId }, transaction: t });

      const rows = cityIds.map((cityId) => ({ serviceId, cityId }));
      if (rows.length) await ServiceCity.bulkCreate(rows, { transaction: t });

      await t.commit();
      res.json({ message: 'Service cities updated' });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ message: 'Failed to assign cities' });
    }
  },

  async unassignServiceCity(req, res) {
    try {
      const serviceId = req.params.id;
      const cityId = req.params.cityId;
      const deleted = await ServiceCity.destroy({ where: { serviceId, cityId }});
      if (!deleted) return res.status(404).json({ message: 'Mapping not found' });
      res.json({ message: 'Mapping deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to delete mapping' });
    }
  },
};

module.exports = adminController;

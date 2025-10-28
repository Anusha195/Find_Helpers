const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);
router.use(authorize('admin'));

router.get('/partner-requests', adminController.listPartnerRequests);
router.get('/partner-requests/:id', adminController.getPartnerRequest);
router.post('/partner-requests/:id/approve', adminController.approvePartnerRequest);
router.post('/partner-requests/:id/reject', adminController.rejectPartnerRequest);

router.get('/categories', adminController.listCategories);
router.get('/categories/:id', adminController.getCategory);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/services', adminController.listServices);
router.get('/services/:id', adminController.getService);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

router.get('/cities', adminController.listCities);
router.post('/cities', adminController.createCity);
router.delete('/cities/:id', adminController.deleteCity);

router.get('/services/:id/cities', adminController.getServiceCities);          
router.post('/services/:id/cities', adminController.assignServiceCities);    
router.delete('/services/:id/cities/:cityId', adminController.unassignServiceCity);

module.exports = router;

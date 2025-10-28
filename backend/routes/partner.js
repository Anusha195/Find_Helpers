const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const {authenticate,authorize} = require('../middlewares/auth');

router.post('/apply', authenticate, partnerController.apply);

router.get('/pending', authenticate, partnerController.getPending);

router.post('/review/:id', authenticate, partnerController.reviewRequest);

module.exports = router;

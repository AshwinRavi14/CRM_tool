const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(billingController.getBillingInfo)
    .post(authorize('ADMIN', 'FOUNDER'), billingController.saveBillingInfo);

module.exports = router;

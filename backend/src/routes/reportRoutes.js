const express = require('express');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all report routes

router
    .route('/')
    .get(reportController.getReports)
    .post(reportController.createReport);

router.get('/activity/salesperson', reportController.getActivitiesBySalesperson);
router.get('/activity/summary', reportController.getActivitiesSummary);
router.get('/customer-insights', reportController.getCustomerInsights);
router.get('/sales-rep-activity', reportController.getSalesRepActivity);


module.exports = router;

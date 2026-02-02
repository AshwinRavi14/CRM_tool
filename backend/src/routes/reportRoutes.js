const express = require('express');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all report routes

router
    .route('/')
    .get(reportController.getReports)
    .post(reportController.createReport);

module.exports = router;

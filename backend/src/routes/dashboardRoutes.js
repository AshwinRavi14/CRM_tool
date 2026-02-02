const express = require('express');
const { getMetrics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/metrics', getMetrics);

module.exports = router;

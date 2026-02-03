const express = require('express');
const { getActivities, logActivity, updateActivityStatus, getMyActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/my', getMyActivities);
router.post('/', logActivity);
router.patch('/:id/status', updateActivityStatus);

module.exports = router;

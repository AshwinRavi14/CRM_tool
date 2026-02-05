const express = require('express');
const { getActivities, logActivity, updateActivityStatus, updateActivity, getMyActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/my', getMyActivities);
router.post('/', logActivity);
router.patch('/:id/status', updateActivityStatus);
router.patch('/:id', updateActivity);


module.exports = router;

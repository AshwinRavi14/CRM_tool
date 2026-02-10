const express = require('express');
const {
    getActivities,
    logActivity,
    updateActivityStatus,
    updateActivity,
    getMyActivities,
    getAllActivities,
    deleteActivity
} = require('../controllers/activityController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAllActivities);
router.get('/by-entity', getActivities);
router.get('/my', getMyActivities);
router.post('/', logActivity);
router.patch('/:id/status', updateActivityStatus);
router.patch('/:id', updateActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);


module.exports = router;

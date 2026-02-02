const express = require('express');
const {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    advanceStage,
    getPipeline
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getOpportunities);
router.post('/', createOpportunity);
router.get('/pipeline', getPipeline);
router.get('/:id', getOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);
router.put('/:id/advance-stage', advanceStage);

module.exports = router;

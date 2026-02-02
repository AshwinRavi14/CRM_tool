const express = require('express');
const { getOpportunities, createOpportunity, advanceStage, getPipeline } = require('../controllers/opportunityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /opportunities:
 *   get:
 *     summary: Get all opportunities
 *     tags: [Opportunities]
 */
router.get('/', getOpportunities);

/**
 * @swagger
 * /opportunities:
 *   post:
 *     summary: Create a new opportunity
 *     tags: [Opportunities]
 */
router.post('/', createOpportunity);

/**
 * @swagger
 * /opportunities/pipeline:
 *   get:
 *     summary: Get sales pipeline
 *     tags: [Opportunities]
 */
router.get('/pipeline', getPipeline);

/**
 * @swagger
 * /opportunities/{id}/advance-stage:
 *   put:
 *     summary: Advance opportunity stage
 *     tags: [Opportunities]
 */
router.put('/:id/advance-stage', advanceStage);

module.exports = router;

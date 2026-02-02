const express = require('express');
const { getLeads, createLead, qualifyLead, convertLead } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

const { createLeadSchema } = require('../validators/crmValidator');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes protected
router.use(protect);

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 */
router.get('/', getLeads);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 */
router.post('/', createLead);

/**
 * @swagger
 * /leads/{id}/qualify:
 *   post:
 *     summary: Qualify a lead
 *     tags: [Leads]
 */
router.post('/:id/qualify', qualifyLead);

/**
 * @swagger
 * /leads/{id}/convert:
 *   post:
 *     summary: Convert lead to account
 *     tags: [Leads]
 */
router.post('/:id/convert', convertLead);

module.exports = router;

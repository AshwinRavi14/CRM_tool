const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getQuotes,
    getQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    generateFromLead,
    updateQuoteStatus
} = require('../controllers/quoteController');

router.use(protect);

router.route('/')
    .get(getQuotes)
    .post(createQuote);

router.route('/:id')
    .get(getQuote)
    .put(updateQuote)
    .delete(deleteQuote);

router.post('/generate-from-lead/:leadId', generateFromLead);
router.patch('/:id/status', updateQuoteStatus);

module.exports = router;

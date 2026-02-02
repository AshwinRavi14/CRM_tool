const express = require('express');
const { exportLeads, exportAccounts, importLeads } = require('../controllers/bulkController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for temp storage
const upload = multer({ dest: 'uploads/' });

router.use(protect);

router.post('/import/leads', authorize('ADMIN', 'SALES_MANAGER'), upload.single('file'), importLeads);
router.get('/export/leads', exportLeads);
router.get('/export/accounts', exportAccounts);

module.exports = router;

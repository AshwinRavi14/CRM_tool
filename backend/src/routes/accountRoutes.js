const express = require('express');
const { getAccounts, getAccount, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/:id', getAccount);
router.put('/:id', updateAccount);
router.delete('/:id', authorize('ADMIN', 'SALES_MANAGER'), deleteAccount);

module.exports = router;

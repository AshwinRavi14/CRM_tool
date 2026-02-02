const express = require('express');
const { getContacts, createContact, updateContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getContacts);
router.post('/', createContact);
router.put('/:id', updateContact);

module.exports = router;

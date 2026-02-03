const express = require('express');
const {
    inviteUser,
    getInvitation,
    acceptInvitation,
    getInvitations,
    deleteInvitation
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes for invited users
router.get('/:token', getInvitation);
router.post('/accept', acceptInvitation);

// Protected Admin routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', inviteUser);
router.get('/', getInvitations);
router.delete('/:id', deleteInvitation);

module.exports = router;

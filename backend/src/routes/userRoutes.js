const express = require('express');
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here require authentication and ADMIN role
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getAllUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;

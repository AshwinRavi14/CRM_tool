const User = require('../models/User');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Get all users (Admin only)
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json(success(users));
});

/**
 * Update user role (Admin only)
 */
const updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        return next(new AppError('Please provide a role', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json(success(user, `User role updated to ${role}`));
});

/**
 * Delete user (Admin only)
 */
const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json(success(null, 'User deleted successfully'));
});

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};

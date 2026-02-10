const Activity = require('../models/Activity');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Get activities for a specific entity
 */
const getActivities = asyncHandler(async (req, res, next) => {
    const { relatedToType, relatedToId } = req.query;

    if (!relatedToType || !relatedToId) {
        return next(new AppError('Entity type and ID are required', 400));
    }

    const activities = await Activity.find({
        relatedToType,
        relatedToId
    }).sort('-createdAt').populate('owner', 'firstName lastName');

    res.status(200).json(success(activities));
});

/**
 * Log a new activity
 */
const logActivity = asyncHandler(async (req, res, next) => {
    const activityData = {
        ...req.body,
        owner: req.user.id
    };

    const activity = await Activity.create(activityData);

    res.status(201).json(success(activity, 'Activity logged successfully'));
});

/**
 * Update activity status
 */
const updateActivityStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        { status, completedDate: status === 'COMPLETED' ? new Date() : null },
        { new: true }
    );

    if (!activity) {
        return next(new AppError('Activity not found', 404));
    }

    res.status(200).json(success(activity, 'Activity updated successfully'));
});

/**
 * Update activity (generic for inline edits)
 */
const updateActivity = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true, runValidators: true }
    );

    if (!activity) {
        return next(new AppError('Activity not found', 404));
    }

    res.status(200).json(success(activity, 'Activity updated successfully'));
});

/**
 * Get all activities for the current user
 */
const getMyActivities = asyncHandler(async (req, res, next) => {
    const activities = await Activity.find({
        owner: req.user.id
    }).sort('-createdAt').populate('relatedToId');

    res.status(200).json(success(activities));
});

/**
 * Get all activities (broad fetch for dashboard)
 */
const getAllActivities = asyncHandler(async (req, res, next) => {
    const { type, status, priority } = req.query;
    const filter = {};

    // For now, let users see their own activities plus those they have access to
    // Admins see everything
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SALES_MANAGER') {
        filter.owner = req.user.id;
    }

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const activities = await Activity.find(filter)
        .sort('-createdAt')
        .populate('owner', 'firstName lastName')
        .populate('relatedToId');

    res.status(200).json(success(activities));
});

/**
 * Delete activity
 */
const deleteActivity = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
        return next(new AppError('Activity not found', 404));
    }

    res.status(200).json(success(null, 'Activity deleted successfully'));
});

module.exports = {
    getActivities,
    logActivity,
    updateActivityStatus,
    updateActivity,
    getMyActivities,
    getAllActivities,
    deleteActivity
};


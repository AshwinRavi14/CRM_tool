const Report = require('../models/Report');
const Activity = require('../models/Activity');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

exports.createReport = asyncHandler(async (req, res, next) => {
    const { name, category, frequency, format } = req.body;

    const report = await Report.create({
        name,
        category,
        frequency,
        format,
        createdBy: req.user.id, // Assumes auth middleware populates req.user
        lastRun: Date.now()
    });

    res.status(201).json({
        status: 'success',
        data: {
            report
        }
    });
});

exports.getReports = asyncHandler(async (req, res, next) => {
    const { category } = req.query;
    const filter = {};

    if (category) {
        // Handle "User Performance" <-> "Performance" mapping if needed, 
        // but frontend sends "Performance" for that category in the modal.
        // We'll trust the query param matches the enum or is close enough.
        filter.category = category;
    }

    // You might want to filter by user or return all reports. 
    // For now, return all reports or filtered by category.
    const reports = await Report.find(filter).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: reports.length,
        data: {
            reports
        }
    });
});

/**
 * Specialized report: Activities by Salesperson
 * Groups activities by assigned user and structures for the Salesforce-style grid.
 */
exports.getActivitiesBySalesperson = asyncHandler(async (req, res, next) => {
    // Fetch all activities and populate owner
    const activities = await Activity.find()
        .populate('owner', 'firstName lastName')
        .populate('relatedToId') // populate generic ref
        .sort('-createdAt');

    // Structure data by Assigned user (Groups)
    const grouped = {};

    activities.forEach(activity => {
        const ownerName = activity.owner ? `${activity.owner.firstName} ${activity.owner.lastName}` : 'Unassigned';
        const ownerId = activity.owner ? activity.owner._id.toString() : 'unassigned';

        if (!grouped[ownerId]) {
            grouped[ownerId] = {
                assigned: ownerName,
                activities: []
            };
        }

        grouped[ownerId].activities.push({
            id: activity._id,
            subject: activity.subject,
            priority: activity.priority || 'NORMAL',
            isTask: activity.type === 'TASK',
            relatedTo: activity.relatedToId,
            relatedToType: activity.relatedToType,
            status: activity.status
        });
    });

    const reportData = Object.values(grouped);

    res.status(200).json({
        status: 'success',
        data: {
            reportData,
            totalRecords: activities.length
        }
    });
});

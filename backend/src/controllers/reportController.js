const mongoose = require('mongoose');
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
        createdBy: req.user.id,
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
        filter.category = category;
    }

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
 * Supports filtering, sorting, and pagination.
 */
exports.getActivitiesBySalesperson = asyncHandler(async (req, res, next) => {
    const {
        owner,
        priority,
        type,
        status,
        startDate,
        endDate,
        sortField = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // 1. Build dynamic filter
    const filter = {};
    if (owner && owner !== 'All') filter.owner = owner;
    if (priority && priority !== 'All') filter.priority = priority;
    if (type && type !== 'All') filter.type = type;
    if (status && status !== 'All') filter.status = status;

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // 2. Fetch activities with population
    // We use lean() for performance and manual population to avoid strictPopulate issues
    let query = Activity.find(filter)
        .populate('owner', 'firstName lastName')
        .populate('relatedToId')
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 });

    const activities = await query.lean();

    // 3. Manual sub-population for Account info
    for (let activity of activities) {
        if (activity.relatedToId && activity.relatedToType) {
            try {
                const RelatedModel = mongoose.model(activity.relatedToType);
                if (['Contact', 'Opportunity', 'Lead'].includes(activity.relatedToType)) {
                    const relatedDoc = await RelatedModel.findById(activity.relatedToId._id)
                        .populate('account', 'companyName') // For Contact/Opportunity
                        .lean();

                    if (relatedDoc) {
                        activity.relatedToId = relatedDoc;
                    }
                }
            } catch (err) {
                // Ignore model errors or missing docs
            }
        }
    }

    // 4. Group data by assigned salesperson
    const grouped = {};
    activities.forEach(activity => {
        const ownerName = activity.owner ? `${activity.owner.firstName} ${activity.owner.lastName}` : 'Unassigned';
        const ownerId = activity.owner ? activity.owner._id.toString() : 'unassigned';

        if (!grouped[ownerId]) {
            grouped[ownerId] = {
                id: ownerId,
                assigned: ownerName,
                activities: []
            };
        }

        grouped[ownerId].activities.push({
            id: activity._id,
            subject: activity.subject,
            priority: activity.priority || 'NORMAL',
            isTask: activity.type === 'TASK',
            relatedToType: activity.relatedToType,
            relatedTo: activity.relatedToId,
            status: activity.status,
            dueDate: activity.dueDate,
            createdAt: activity.createdAt,
            // Extract display names for table
            companyAccount: activity.relatedToId?.account?.companyName || activity.relatedToId?.companyName || activity.relatedToId?.company || '-',
            contact: activity.relatedToType === 'Contact' && activity.relatedToId ? `${activity.relatedToId.firstName || 'Unknown'} ${activity.relatedToId.lastName || 'Contact'}` : '-',
            lead: activity.relatedToType === 'Lead' && activity.relatedToId ? `${activity.relatedToId.firstName || 'Unknown'} ${activity.relatedToId.lastName || 'Lead'}` : '-',
            opportunity: activity.relatedToType === 'Opportunity' ? (activity.relatedToId?.name || 'Unknown Opportunity') : '-'
        });
    });

    res.status(200).json({
        status: 'success',
        data: {
            reportData: Object.values(grouped),
            totalRecords: activities.length
        }
    });
});

/**
 * Summary data for charts
 */
exports.getActivitiesSummary = asyncHandler(async (req, res, next) => {
    // Basic aggregation for chart metrics
    const summary = await Activity.aggregate([
        {
            $group: {
                _id: '$owner',
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                name: { $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'] },
                count: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            summary: summary.map(s => ({ name: s.name || 'Unassigned', count: s.count }))
        }
    });
});


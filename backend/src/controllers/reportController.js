const Report = require('../models/Report');
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

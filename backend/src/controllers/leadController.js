const leadService = require('../services/leadService');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const Lead = require('../models/Lead'); // Added for ownership checks
const { getReports, hasAccess } = require('../utils/securityUtils');
const AuditLog = require('../models/AuditLog');

/**
 * Get all leads
 */
const getLeads = asyncHandler(async (req, res, next) => {
    const { page, limit, status, rating } = req.query;

    // Ownership & Hierarchy Filter
    const filter = {};
    if (req.user.role !== 'ADMIN') {
        const reportIds = await getReports(req.user.id);
        // Sales Reps/Managers see their own leads + their reports' leads + the unassigned "Lead Pool"
        filter.owner = { $in: [req.user.id, ...reportIds, null] };
    }

    if (status) filter.status = status;
    if (rating) filter.rating = rating;

    const result = await leadService.getLeads(filter, { page, limit });
    res.status(200).json(success(result));
});

/**
 * Create a new lead
 */
const createLead = asyncHandler(async (req, res, next) => {
    const lead = await leadService.createLead(req.body, req.user.id);

    await AuditLog.create({
        user: req.user.id,
        action: 'CREATE',
        resource: 'Lead',
        resourceId: lead._id,
        ipAddress: req.ip
    });

    res.status(201).json(success(lead, 'Lead created successfully'));
});

/**
 * Qualify a lead
 */
const qualifyLead = asyncHandler(async (req, res, next) => {
    const { rating, notes } = req.body;

    // Check ownership & hierarchy first
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    const authorized = await hasAccess(req.user, lead.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this lead', 403));
    }

    const updatedLead = await leadService.qualifyLead(req.params.id, rating, notes);
    res.status(200).json(success(updatedLead, 'Lead qualified successfully'));
});

/**
 * Convert a lead to account/contact
 */
const convertLead = asyncHandler(async (req, res, next) => {
    // Check ownership & hierarchy first
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    const authorized = await hasAccess(req.user, lead.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this lead', 403));
    }

    try {
        const result = await leadService.convertLead(req.params.id, req.user.id);

        await AuditLog.create({
            user: req.user.id,
            action: 'UPDATE', // Or CREATE for new account
            resource: 'Lead',
            resourceId: lead._id,
            details: { status: 'CONVERTED' }
        });

        res.status(200).json(success(result, 'Lead converted successfully'));
    } catch (err) {
        // leadService might throw specific logic errors
        return next(new AppError(err.message, 400));
    }
});

module.exports = {
    getLeads,
    createLead,
    qualifyLead,
    convertLead
};

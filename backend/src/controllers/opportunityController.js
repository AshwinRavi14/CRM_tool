const opportunityService = require('../services/opportunityService');
const Opportunity = require('../models/Opportunity');
const { success } = require('../utils/apiResponse');
const { generateOpportunityNumber } = require('../utils/numberGenerator');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { getReports, hasAccess } = require('../utils/securityUtils');
const AuditLog = require('../models/AuditLog');

/**
 * Get all opportunities
 */
const getOpportunities = asyncHandler(async (req, res, next) => {
    // Ownership & Hierarchy Filter
    const filter = {};
    if (req.user.role !== 'ADMIN') {
        const reportIds = await getReports(req.user.id);
        filter.owner = { $in: [req.user.id, ...reportIds] };
    }

    const opportunities = await Opportunity.find(filter)
        .populate('account', 'companyName')
        .populate('primaryContact', 'firstName lastName');
    res.status(200).json(success(opportunities));
});

/**
 * Create new opportunity
 */
const createOpportunity = asyncHandler(async (req, res, next) => {
    const oppNumber = generateOpportunityNumber();
    const opportunity = await Opportunity.create({
        ...req.body,
        opportunityNumber: oppNumber,
        owner: req.user.id
    });

    await AuditLog.create({
        user: req.user.id,
        action: 'CREATE',
        resource: 'Opportunity',
        resourceId: opportunity._id,
        ipAddress: req.ip
    });

    res.status(201).json(success(opportunity, 'Opportunity created successfully'));
});

/**
 * Advance opportunity stage
 */
const advanceStage = asyncHandler(async (req, res, next) => {
    const { newStage } = req.body;

    // Check ownership & hierarchy first
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return next(new AppError('Opportunity not found', 404));

    const authorized = await hasAccess(req.user, opportunity.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this opportunity', 403));
    }

    try {
        const updatedOpp = await opportunityService.advanceStage(req.params.id, newStage, req.user.id);

        await AuditLog.create({
            user: req.user.id,
            action: 'UPDATE',
            resource: 'Opportunity',
            resourceId: opportunity._id,
            details: { newStage }
        });

        res.status(200).json(success(updatedOpp, 'Stage advanced successfully'));
    } catch (err) {
        // Service might throw logic error like "Invalid transition"
        return next(new AppError(err.message, 400));
    }
});

/**
 * Get sales pipeline for user
 */
const getPipeline = asyncHandler(async (req, res, next) => {
    // If ADMIN, they can see everything. Otherwise just their own + reports.
    let ownerId = req.user.id;
    if (req.user.role === 'ADMIN') {
        // We might want a different service method or pass null to service to signify 'all'
        const pipeline = await opportunityService.getPipeline(null); // Passing null for all
        return res.status(200).json(success(pipeline));
    }

    const pipeline = await opportunityService.getPipeline(ownerId);
    res.status(200).json(success(pipeline));
});

const logger = require('../utils/logger');

/**
 * Get forecast data for user
 */
const getForecasts = asyncHandler(async (req, res, next) => {
    // Ownership & Hierarchy Filter
    const filter = {};
    if (req.user.role !== 'ADMIN') {
        const reportIds = await getReports(req.user.id);
        filter.owner = { $in: [req.user.id, ...reportIds] };
    }

    const opportunities = await Opportunity.find(filter)
        .populate('account', 'companyName')
        .populate('primaryContact', 'firstName lastName')
        .populate('owner', 'firstName lastName');

    // Aggregate metrics
    const forecasts = {
        quota: 2000, // Placeholder as Quota is not in the model yet
        commit: 0,
        bestCase: 0,
        openPipeline: 0,
        opportunities: opportunities
    };

    opportunities.forEach(opp => {
        if (opp.stage === 'CLOSED_WON' || opp.stage === 'NEGOTIATION' || opp.stage === 'PROPOSAL') {
            forecasts.commit += opp.amount || 0;
        }
        if (opp.stage !== 'CLOSED_LOST') {
            forecasts.bestCase += opp.amount || 0;
        }
        if (opp.stage !== 'CLOSED_WON' && opp.stage !== 'CLOSED_LOST') {
            forecasts.openPipeline += opp.amount || 0;
        }
    });

    res.status(200).json(success(forecasts));
});

/**
 * Get single opportunity
 */
const getOpportunity = asyncHandler(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id)
        .populate('account')
        .populate('primaryContact')
        .populate('owner', 'firstName lastName email');

    if (!opportunity) return next(new AppError('Opportunity not found', 404));

    const authorized = await hasAccess(req.user, opportunity.owner._id);
    if (!authorized) {
        return next(new AppError('Not authorized to access this opportunity', 403));
    }

    res.status(200).json(success(opportunity));
});

/**
 * Update opportunity
 */
const updateOpportunity = asyncHandler(async (req, res, next) => {
    let opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return next(new AppError('Opportunity not found', 404));

    const authorized = await hasAccess(req.user, opportunity.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this opportunity', 403));
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    await AuditLog.create({
        user: req.user.id,
        action: 'UPDATE',
        resource: 'Opportunity',
        resourceId: opportunity._id,
        ipAddress: req.ip
    });

    res.status(200).json(success(opportunity, 'Opportunity updated successfully'));
});

/**
 * Delete opportunity
 */
const deleteOpportunity = asyncHandler(async (req, res, next) => {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return next(new AppError('Opportunity not found', 404));

    const authorized = await hasAccess(req.user, opportunity.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this opportunity', 403));
    }

    await opportunity.deleteOne();

    await AuditLog.create({
        user: req.user.id,
        action: 'DELETE',
        resource: 'Opportunity',
        resourceId: req.params.id,
        ipAddress: req.ip
    });

    res.status(200).json(success(null, 'Opportunity deleted successfully'));
});

module.exports = {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    advanceStage,
    getPipeline,
    getForecasts
};

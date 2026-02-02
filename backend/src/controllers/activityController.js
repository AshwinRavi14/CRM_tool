const Activity = require('../models/Activity');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const getActivities = asyncHandler(async (req, res, next) => {
    const { lead, account, opportunity, project } = req.query;
    const filter = {};
    if (lead) filter.lead = lead;
    if (account) filter.account = account;
    if (opportunity) filter.opportunity = opportunity;
    if (project) filter.project = project;

    const activities = await Activity.find(filter)
        .sort('-activityDate')
        .populate('user', 'firstName lastName');
    res.status(200).json(success(activities));
});

const createActivity = asyncHandler(async (req, res, next) => {
    const activity = await Activity.create({
        ...req.body,
        user: req.user.id
    });
    res.status(201).json(success(activity, 'Activity logged successfully'));
});

module.exports = {
    getActivities,
    createActivity
};

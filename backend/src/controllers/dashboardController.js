const Lead = require('../models/Lead');
const Account = require('../models/Account');
const Opportunity = require('../models/Opportunity');
const Project = require('../models/Project');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const getMetrics = asyncHandler(async (req, res, next) => {
    const totalLeads = await Lead.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const totalProjects = await Project.countDocuments();

    const openOpportunities = await Opportunity.countDocuments({ stage: { $ne: 'CLOSED_WON' } });
    const wonOpportunities = await Opportunity.countDocuments({ stage: 'CLOSED_WON' });

    const pipelineValue = await Opportunity.aggregate([
        { $match: { stage: { $ne: 'CLOSED_LOST' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json(success({
        totals: {
            leads: totalLeads,
            accounts: totalAccounts,
            opportunities: totalOpportunities,
            projects: totalProjects
        },
        sales: {
            open: openOpportunities,
            won: wonOpportunities,
            pipelineValue: pipelineValue[0]?.total || 0,
            winRate: totalOpportunities > 0 ? (wonOpportunities / totalOpportunities * 100).toFixed(2) : 0
        }
    }));
});

module.exports = {
    getMetrics
};

const Lead = require('../models/Lead');
const Account = require('../models/Account');
const Opportunity = require('../models/Opportunity');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Global search across multiple entities
 */
const globalSearch = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    if (!q) {
        return next(new AppError('Search query is required', 400));
    }

    const searchRegex = new RegExp(q, 'i');

    const [leads, accounts, opportunities] = await Promise.all([
        Lead.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { company: searchRegex }
            ]
        }).limit(5),
        Account.find({
            $or: [
                { companyName: searchRegex },
                { email: searchRegex }
            ]
        }).limit(5),
        Opportunity.find({
            name: searchRegex
        }).limit(5)
    ]);

    res.status(200).json(success({
        leads,
        accounts,
        opportunities
    }));
});

module.exports = {
    globalSearch
};

const Account = require('../models/Account');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { generateAccountNumber } = require('../utils/numberGenerator');
const { getReports, hasAccess } = require('../utils/securityUtils');
const AuditLog = require('../models/AuditLog');

const getAccounts = asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.user.role !== 'ADMIN') {
        const reportIds = await getReports(req.user.id);
        filter = { owner: { $in: [req.user.id, ...reportIds] } };
    }

    const accounts = await Account.find(filter).populate('owner', 'firstName lastName');
    res.status(200).json(success(accounts));
});

const getAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findById(req.params.id)
        .populate('contacts')
        .populate('opportunities')
        .populate('projects');
    if (!account) return next(new AppError('Account not found', 404));

    // Ownership & Hierarchy check
    const authorized = await hasAccess(req.user, account.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to access this account', 403));
    }

    res.status(200).json(success(account));
});

const createAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.create({
        ...req.body,
        accountNumber: generateAccountNumber(),
        owner: req.user.id
    });

    await AuditLog.create({
        user: req.user.id,
        action: 'CREATE',
        resource: 'Account',
        resourceId: account._id,
        ipAddress: req.ip
    });

    res.status(201).json(success(account, 'Account created successfully'));
});

const updateAccount = asyncHandler(async (req, res, next) => {
    let account = await Account.findById(req.params.id);
    if (!account) return next(new AppError('Account not found', 404));

    // Ownership & Hierarchy check
    const authorized = await hasAccess(req.user, account.owner);
    if (!authorized) {
        return next(new AppError('Not authorized to update this account', 403));
    }

    account = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(success(account, 'Account updated successfully'));
});

const deleteAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findById(req.params.id);
    if (!account) return next(new AppError('Account not found', 404));

    // Ownership & Hierarchy check
    const authorized = await hasAccess(req.user, account.owner);
    if (!authorized) {
        await AuditLog.create({
            user: req.user.id,
            action: 'ACCESS_DENIED',
            resource: 'Account',
            resourceId: account._id,
            details: { attempt: 'DELETE' }
        });
        return next(new AppError('Not authorized to delete this account', 403));
    }

    // Example check: block deletion if it has opportunities
    // const hasDeals = await Opportunity.countDocuments({ account: account._id });
    // if (hasDeals > 0) return next(new AppError('Cannot delete account with active deals.', 400));

    // Use soft delete provided by mongoose-delete plugin
    await account.delete();

    await AuditLog.create({
        user: req.user.id,
        action: 'DELETE',
        resource: 'Account',
        resourceId: account._id,
        ipAddress: req.ip
    });

    res.status(200).json(success(null, 'Account deleted successfully'));
});

module.exports = {
    getAccounts,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount
};

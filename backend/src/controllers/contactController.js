const Contact = require('../models/Contact');
const Account = require('../models/Account');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const getContacts = asyncHandler(async (req, res, next) => {
    // Non-admins only see contacts for accounts they own
    let filter = {};
    if (req.user.role !== 'ADMIN') {
        const userAccounts = await Account.find({ owner: req.user.id }).select('_id');
        const accountIds = userAccounts.map(acc => acc._id);
        filter = { account: { $in: accountIds } };
    }

    const contacts = await Contact.find(filter).populate('account', 'companyName');
    res.status(200).json(success(contacts));
});

const createContact = asyncHandler(async (req, res, next) => {
    // Verify account ownership
    const account = await Account.findById(req.body.account);
    if (!account) return next(new AppError('Account not found', 404));

    if (account.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new AppError('Not authorized to add contacts to this account', 403));
    }

    const contact = await Contact.create(req.body);
    res.status(201).json(success(contact, 'Contact created successfully'));
});

const updateContact = asyncHandler(async (req, res, next) => {
    let contact = await Contact.findById(req.params.id).populate('account');
    if (!contact) return next(new AppError('Contact not found', 404));

    // Check ownership of parent account
    if (contact.account && contact.account.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        return next(new AppError('Not authorized to access this contact', 403));
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(success(contact, 'Contact updated successfully'));
});

module.exports = {
    getContacts,
    createContact,
    updateContact
};

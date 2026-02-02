const Lead = require('../models/Lead');
const Account = require('../models/Account');
const Contact = require('../models/Contact');
const { generateAccountNumber, generateLeadNumber } = require('../utils/numberGenerator');
const { publishEvent } = require('./eventService');

/**
 * Lead Service handles all operations related to leads
 */
const createLead = async (leadData, userId) => {
    const leadNumber = generateLeadNumber();
    const lead = await Lead.create({
        ...leadData,
        leadNumber,
        owner: userId
    });
    return lead;
};

const getLeads = async (filter = {}, options = {}) => {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const leads = await Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'firstName lastName email');

    const total = await Lead.countDocuments(filter);

    return { leads, total, page, pages: Math.ceil(total / limit) };
};

const qualifyLead = async (leadId, rating, notes) => {
    const lead = await Lead.findByIdAndUpdate(
        leadId,
        { status: 'QUALIFIED', rating, notes, lastContactDate: new Date() },
        { new: true }
    );

    if (lead) {
        await publishEvent('LeadQualified', lead._id, 'Lead', { rating });
    }

    return lead;
};

const convertLead = async (leadId, userId) => {
    const lead = await Lead.findById(leadId);

    if (!lead) throw new Error('Lead not found');
    if (lead.status === 'CONVERTED') throw new Error('Lead already converted');

    // 1. Create Account
    const accountNumber = generateAccountNumber();
    const account = await Account.create({
        accountNumber,
        companyName: lead.company || `${lead.firstName} ${lead.lastName}`,
        accountType: 'PROSPECT',
        phone: lead.phone,
        email: lead.email,
        owner: lead.owner,
        createdBy: userId,
        status: 'ACTIVE'
    });

    // 2. Create Contact
    const contact = await Contact.create({
        account: account._id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        isPrimary: true
    });

    // 3. Update Lead Status
    lead.status = 'CONVERTED';
    lead.convertedAccount = account._id;
    await lead.save();

    // 4. Publish Event
    await publishEvent('LeadConverted', lead._id, 'Lead', {
        accountId: account._id,
        contactId: contact._id
    });

    return { lead, account, contact };
};

module.exports = {
    createLead,
    getLeads,
    qualifyLead,
    convertLead
};

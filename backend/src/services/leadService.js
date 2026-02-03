const Lead = require('../models/Lead');
const Account = require('../models/Account');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const { generateAccountNumber, generateLeadNumber } = require('../utils/numberGenerator');
const { publishEvent } = require('./eventService');
const assignmentService = require('./assignmentService');

/**
 * Lead Service handles all operations related to leads
 */
const createLead = async (leadData, userId) => {
    const leadNumber = generateLeadNumber();

    // Automation: If source is LINKEDIN or owner is not provided, 
    // trigger automated round-robin assignment
    let ownerId = userId;
    if (!ownerId || leadData.source === 'LINKEDIN') {
        const assignedId = await assignmentService.assignLeadRoundRobin();
        if (assignedId) ownerId = assignedId;
    }

    const lead = await Lead.create({
        ...leadData,
        leadNumber,
        owner: ownerId
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
        owner: lead.owner || userId, // Fallback to current user if unassigned
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
        isPrimary: true,
        owner: account.owner // Sync owner
    });

    // 3. Create Automated "Discovery Task" for the Sales Rep
    await Activity.create({
        type: 'TASK',
        subject: `Discovery Call: ${account.companyName}`,
        description: `Automated task created from Lead conversion (${lead.leadNumber}). Please schedule a discovery session.`,
        status: 'PLANNED',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
        relatedToType: 'Account',
        relatedToId: account._id,
        owner: account.owner
    });

    // 4. Update Lead Status
    lead.status = 'CONVERTED';
    lead.convertedAccount = account._id;
    if (!lead.owner) lead.owner = userId; // Take ownership on conversion if unassigned
    await lead.save();

    // 5. Publish Event
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

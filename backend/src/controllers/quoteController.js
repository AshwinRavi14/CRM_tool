const Quote = require('../models/Quote');
const Lead = require('../models/Lead');
const logger = require('../utils/logger');

// Generate unique quote number
const generateQuoteNumber = async () => {
    const count = await Quote.countDocuments();
    return `QT-${String(count + 1).padStart(5, '0')}`;
};

// @desc    Get all quotes
// @route   GET /api/quotes
exports.getQuotes = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = { owner: req.user._id };

        if (status && status !== 'ALL') filter.status = status;
        if (search) {
            filter.$or = [
                { quoteNumber: { $regex: search, $options: 'i' } },
                { contactName: { $regex: search, $options: 'i' } },
                { companyName: { $regex: search, $options: 'i' } }
            ];
        }

        // Admin/managers can see all quotes
        if (['ADMIN', 'SALES_MANAGER'].includes(req.user.role)) {
            delete filter.owner;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [quotes, total] = await Promise.all([
            Quote.find(filter)
                .populate('lead', 'firstName lastName email company')
                .populate('account', 'companyName')
                .populate('owner', 'firstName lastName')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Quote.countDocuments(filter)
        ]);

        res.json({ quotes, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        logger.error('Error fetching quotes:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single quote
// @route   GET /api/quotes/:id
exports.getQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id)
            .populate('lead', 'firstName lastName email company phone')
            .populate('account', 'companyName')
            .populate('owner', 'firstName lastName email');

        if (!quote) return res.status(404).json({ message: 'Quote not found' });
        res.json(quote);
    } catch (err) {
        logger.error('Error fetching quote:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a quote
// @route   POST /api/quotes
exports.createQuote = async (req, res) => {
    try {
        const quoteNumber = await generateQuoteNumber();
        const quote = await Quote.create({
            ...req.body,
            quoteNumber,
            owner: req.user._id
        });

        const populated = await Quote.findById(quote._id)
            .populate('lead', 'firstName lastName email company')
            .populate('account', 'companyName')
            .populate('owner', 'firstName lastName');

        res.status(201).json(populated);
    } catch (err) {
        logger.error('Error creating quote:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update a quote
// @route   PUT /api/quotes/:id
exports.updateQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Quote not found' });

        Object.assign(quote, req.body);
        await quote.save();

        const populated = await Quote.findById(quote._id)
            .populate('lead', 'firstName lastName email company')
            .populate('account', 'companyName')
            .populate('owner', 'firstName lastName');

        res.json(populated);
    } catch (err) {
        logger.error('Error updating quote:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
exports.deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) return res.status(404).json({ message: 'Quote not found' });
        res.json({ message: 'Quote deleted' });
    } catch (err) {
        logger.error('Error deleting quote:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate quote from lead
// @route   POST /api/quotes/generate-from-lead/:leadId
exports.generateFromLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.leadId);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        const quoteNumber = await generateQuoteNumber();
        const quote = await Quote.create({
            quoteNumber,
            lead: lead._id,
            contactName: `${lead.firstName} ${lead.lastName}`,
            contactEmail: lead.email,
            companyName: lead.company,
            items: req.body.items || [],
            taxRate: req.body.taxRate || 0,
            notes: req.body.notes || '',
            owner: req.user._id
        });

        const populated = await Quote.findById(quote._id)
            .populate('lead', 'firstName lastName email company')
            .populate('owner', 'firstName lastName');

        res.status(201).json(populated);
    } catch (err) {
        logger.error('Error generating quote from lead:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update quote status
// @route   PATCH /api/quotes/:id/status
exports.updateQuoteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('lead', 'firstName lastName email company')
            .populate('account', 'companyName')
            .populate('owner', 'firstName lastName');

        if (!quote) return res.status(404).json({ message: 'Quote not found' });
        res.json(quote);
    } catch (err) {
        logger.error('Error updating quote status:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

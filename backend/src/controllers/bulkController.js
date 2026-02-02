const Lead = require('../models/Lead');
const Account = require('../models/Account');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Export Leads to CSV
 */
const exportLeads = asyncHandler(async (req, res, next) => {
    const leads = await Lead.find({}).lean();
    const fields = ['firstName', 'lastName', 'email', 'company', 'status', 'source', 'leadNumber'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads_export.csv');
    return res.send(csv);
});

const exportAccounts = asyncHandler(async (req, res, next) => {
    const accounts = await Account.find({}).lean();
    const fields = ['companyName', 'industry', 'type', 'email', 'phone', 'accountNumber'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(accounts);

    res.header('Content-Type', 'text/csv');
    res.attachment('accounts_export.csv');
    return res.send(csv);
});

const importLeads = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a CSV file', 400));
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Simple bulk insert with basic validation
                const leads = await Lead.insertMany(results, { ordered: false });
                fs.unlinkSync(req.file.path); // Delete temp file
                res.status(201).json(success(leads, `${leads.length} leads imported successfully`));
            } catch (bulkErr) {
                // Return a generic error but don't crash middleware chain inside stream callback
                // Note: since this is a callback, next() won't work as expected if response is already sent?
                // Actually res.status is better here as we are inside the stream 'end' event.
                // Or we can wrap insertMany in a promise to await it in the main flow?
                // For now, let's keep the inner try/catch but return standardized JSON.
                res.status(400).json(error('Bulk import failed: Some records may be duplicates', 400));
            }
        });
});

module.exports = {
    exportLeads,
    exportAccounts,
    importLeads
};

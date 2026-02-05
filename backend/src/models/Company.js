const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    industry: String,
    website: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'TRIAL', 'SUSPENDED'],
        default: 'TRIAL'
    },
    trialEndsAt: {
        type: Date,
        default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema);

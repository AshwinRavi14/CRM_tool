const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    opportunityNumber: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Opportunity name is required'],
        trim: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    primaryContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    stage: {
        type: String,
        enum: ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'],
        default: 'PROSPECTING'
    },
    amount: {
        type: Number,
        default: 0
    },
    expectedCloseDate: Date,
    closedDate: Date,
    probability: {
        type: Number,
        default: 10
    },
    description: String,
    opportunityType: {
        type: String,
        enum: ['NEW_BUSINESS', 'EXPANSION', 'RENEWAL', 'AI_INTEGRATION']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    competitionLevel: {
        type: String,
        enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
        default: 'NONE'
    },
    competitorNames: String,
    forecastAmount: {
        type: Number,
        default: 0
    },
    lostReason: String,
    associatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Opportunity', opportunitySchema);

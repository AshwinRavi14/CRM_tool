const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadNumber: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: String,
    company: String,
    source: {
        type: String,
        enum: ['WEBSITE', 'REFERRAL', 'LINKEDIN', 'CONFERENCE', 'COLD_CALL', 'EMAIL', 'OTHER'],
        required: true
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED', 'LOST'],
        default: 'NEW'
    },
    rating: {
        type: String,
        enum: ['HOT', 'WARM', 'COLD'],
        default: 'COLD'
    },
    notes: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastContactDate: Date,
    nextFollowUpDate: Date,
    interestAreas: [{
        type: String
    }],
    convertedAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, {
    timestamps: true
});

const mongooseDelete = require('mongoose-delete');

leadSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Lead', leadSchema);

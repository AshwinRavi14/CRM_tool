const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        unique: true,
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    accountType: {
        type: String,
        enum: ['PROSPECT', 'CUSTOMER', 'PARTNER'],
        required: true,
        set: v => v ? v.toUpperCase() : v
    },
    industry: {
        type: String,
        enum: ['AI_DEVELOPMENT', 'HEALTHCARE', 'RETAIL', 'FINANCE', 'LOGISTICS', 'ENERGY', 'MANUFACTURING', 'TECHNOLOGY', 'OTHER'],
        default: 'OTHER',
        set: v => v ? v.toUpperCase() : v
    },
    website: String,
    phone: String,
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    description: String,
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        default: 'ACTIVE'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    annualRevenue: {
        type: Number,
        default: 0
    },
    salesStage: {
        type: String,
        enum: ['Qualifying', 'Nurturing', 'Proposal', 'Negotiation', 'Closed Won'],
        default: 'Qualifying'
    },
    nextFollowUp: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for related contacts
accountSchema.virtual('contacts', {
    ref: 'Contact',
    localField: '_id',
    foreignField: 'account',
    justOne: false
});

// Virtual for related opportunities
accountSchema.virtual('opportunities', {
    ref: 'Opportunity',
    localField: '_id',
    foreignField: 'account',
    justOne: false
});

// Virtual for related projects
accountSchema.virtual('projects', {
    ref: 'Project',
    localField: '_id',
    foreignField: 'account',
    justOne: false
});

const mongooseDelete = require('mongoose-delete');

accountSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Account', accountSchema);

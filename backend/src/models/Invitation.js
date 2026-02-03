const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    role: {
        type: String,
        required: [true, 'Please provide a role'],
        enum: ['ADMIN', 'SALES_MANAGER', 'SALES_REP', 'ACCOUNT_MANAGER', 'PROJECT_MANAGER', 'SUPPORT_STAFF'],
        default: 'SALES_REP'
    },
    token: {
        type: String,
        required: true
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'EXPIRED'],
        default: 'PENDING'
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// No pre-save hooks needed as hashing is handled in controller

module.exports = mongoose.model('Invitation', invitationSchema);

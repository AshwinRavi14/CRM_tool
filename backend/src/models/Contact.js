const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
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
    title: String,
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: String,
    mobile: String,
    isDecisionMaker: {
        type: Boolean,
        default: false
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    department: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);

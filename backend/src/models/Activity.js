const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activityType: {
        type: String,
        enum: ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK'],
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    activityDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);

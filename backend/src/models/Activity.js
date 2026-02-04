const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE'],
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    status: {
        type: String,
        enum: ['PLANNED', 'COMPLETED', 'CANCELLED'],
        default: 'COMPLETED'
    },
    priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH'],
        default: 'NORMAL'
    },
    dueDate: Date,
    completedDate: Date,

    // Relationships
    relatedToType: {
        type: String,
        enum: ['Lead', 'Contact', 'Account', 'Opportunity'],
        required: true
    },
    relatedToId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'relatedToType'
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);

const mongoose = require('mongoose');

const domainEventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },
    aggregateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    aggregateType: {
        type: String,
        required: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    occurredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('DomainEvent', domainEventSchema);

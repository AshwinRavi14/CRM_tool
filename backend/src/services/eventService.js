const EventEmitter = require('events');
const DomainEvent = require('../models/DomainEvent');

class CRMEventEmitter extends EventEmitter { }

const eventEmitter = new CRMEventEmitter();

/**
 * Event Service to publish and log domain events
 */
const publishEvent = async (eventType, aggregateId, aggregateType, payload) => {
    try {
        // Log the event to database for audit trail
        await DomainEvent.create({
            eventType,
            aggregateId,
            aggregateType,
            payload,
            occurredAt: new Date()
        });

        // Emit the event for internal subscribers
        eventEmitter.emit(eventType, { aggregateId, aggregateType, payload });
    } catch (err) {
        console.error('Error publishing domain event:', err);
    }
};

module.exports = {
    eventEmitter,
    publishEvent
};

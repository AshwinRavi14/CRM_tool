const { eventEmitter } = require('../../services/eventService');
const { createProjectFromOpportunity } = require('../../services/projectService');

/**
 * Opportunity Event Handlers
 */
const registerOpportunityHandlers = () => {
    // Listen for OpportunityWon event
    eventEmitter.on('OpportunityWon', async (data) => {
        try {
            console.log(`Processing OpportunityWon for aggregate: ${data.aggregateId}`);
            // In a real system, you might want to check if a project already exists
            // For this demo, we'll create one automatically
            // We'd need a userId, maybe from the payload or a system user
            const userId = data.payload.ownerId || data.aggregateId; // Fallback for demo
            await createProjectFromOpportunity(data.aggregateId, userId);
        } catch (err) {
            console.error('Error in OpportunityWon handler:', err);
        }
    });

    console.log('Opportunity event handlers registered');
};

module.exports = {
    registerOpportunityHandlers
};

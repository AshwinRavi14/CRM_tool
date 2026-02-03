const User = require('../models/User');

/**
 * Service to handle automated lead assignment
 */
class AssignmentService {
    /**
     * Assigns a lead to a SALES_REP using Round Robin logic
     * @param {string} leadId - The ID of the lead to assign
     * @returns {Promise<string>} - The ID of the assigned user
     */
    async assignLeadRoundRobin() {
        // 1. Get all active SALES_REP users
        const salesReps = await User.find({
            role: 'SALES_REP',
            status: 'ACTIVE'
        }).sort({ lastAssignedAt: 1 }); // Sort by who was assigned a lead longest ago

        if (!salesReps || salesReps.length === 0) {
            // If no sales reps, fall back to an admin or leave unassigned
            const admin = await User.findOne({ role: 'ADMIN' });
            return admin ? admin._id : null;
        }

        // 2. Select the first one (the one who hasn't been assigned a lead for the longest time)
        const selectedRep = salesReps[0];

        // 3. Update their lastAssignedAt timestamp
        selectedRep.lastAssignedAt = new Date();
        await selectedRep.save();

        return selectedRep._id;
    }
}

module.exports = new AssignmentService();

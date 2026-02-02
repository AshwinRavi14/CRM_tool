const User = require('../models/User');

/**
 * Get all user IDs that report to this manager (direct and indirect)
 */
const getReports = async (managerId) => {
    const directReports = await User.find({ manager: managerId }).select('_id');
    const directReportIds = directReports.map(report => report._id.toString());

    let allReportIds = [...directReportIds];

    for (const reportId of directReportIds) {
        const subReports = await getReports(reportId);
        allReportIds = [...allReportIds, ...subReports];
    }

    return allReportIds;
};

/**
 * Check if the user is the owner, an admin, or the manager of the owner
 */
const hasAccess = async (user, resourceOwnerId) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.id === resourceOwnerId.toString()) return true;

    const reports = await getReports(user.id);
    return reports.includes(resourceOwnerId.toString());
};

module.exports = { getReports, hasAccess };

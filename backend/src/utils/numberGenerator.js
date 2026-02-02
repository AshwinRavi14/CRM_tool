/**
 * Generates unique identifiers for different CRM entities
 */

const generateLeadNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `LEAD-${year}-${random}`;
};

const generateAccountNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ACC-${year}-${random}`;
};

const generateOpportunityNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `OPP-${year}-${random}`;
};

const generateProjectCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PRJ-${year}-${random}`;
};

module.exports = {
    generateLeadNumber,
    generateAccountNumber,
    generateOpportunityNumber,
    generateProjectCode
};

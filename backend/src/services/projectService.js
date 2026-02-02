const Project = require('../models/Project');
const ProjectPhase = require('../models/ProjectPhase');
const Opportunity = require('../models/Opportunity');
const { generateProjectCode } = require('../utils/numberGenerator');
const { publishEvent } = require('./eventService');

const createProjectFromOpportunity = async (opportunityId, userId) => {
    const opportunity = await Opportunity.findById(opportunityId).populate('account');

    if (!opportunity) throw new Error('Opportunity not found');

    const projectCode = generateProjectCode();
    const project = await Project.create({
        projectCode,
        projectName: opportunity.name,
        account: opportunity.account._id,
        opportunity: opportunity._id,
        status: 'PLANNING',
        budget: opportunity.amount,
        projectManager: userId,
        teamMembers: [{ user: userId, role: 'Initial PM' }]
    });

    // Create default phases
    const phases = [
        { name: 'Planning', type: 'PLANNING' },
        { name: 'Data Preparation', type: 'DATA_PREP' },
        { name: 'Model Development', type: 'MODEL_DEV' },
        { name: 'Validation', type: 'VALIDATION' },
        { name: 'Deployment', type: 'DEPLOYMENT' }
    ];

    for (const phase of phases) {
        await ProjectPhase.create({
            project: project._id,
            phaseName: phase.name,
            phaseType: phase.type,
            status: 'PENDING'
        });
    }

    opportunity.associatedProject = project._id;
    await opportunity.save();

    await publishEvent('ProjectCreated', project._id, 'Project', {
        opportunityId: opportunity._id
    });

    return project;
};

module.exports = {
    createProjectFromOpportunity
};

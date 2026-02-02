const Opportunity = require('../models/Opportunity');
const Project = require('../models/Project');
const { generateOpportunityNumber, generateProjectCode } = require('../utils/numberGenerator');
const { publishEvent } = require('./eventService');

const stageProbabilities = {
    PROSPECTING: 10,
    QUALIFICATION: 25,
    PROPOSAL: 50,
    NEGOTIATION: 75,
    CLOSED_WON: 100,
    CLOSED_LOST: 0
};

const advanceStage = async (opportunityId, newStage, userId) => {
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) throw new Error('Opportunity not found');

    const probability = stageProbabilities[newStage];
    if (probability === undefined) throw new Error('Invalid stage');

    opportunity.stage = newStage;
    opportunity.probability = probability;

    if (newStage === 'CLOSED_WON') {
        opportunity.closedDate = new Date();
        // Logic to create project could be triggered here or via event handler
    } else if (newStage === 'CLOSED_LOST') {
        opportunity.closedDate = new Date();
    }

    await opportunity.save();

    await publishEvent('OpportunityStageChanged', opportunity._id, 'Opportunity', {
        newStage,
        probability
    });

    if (newStage === 'CLOSED_WON') {
        await publishEvent('OpportunityWon', opportunity._id, 'Opportunity', {
            accountId: opportunity.account,
            amount: opportunity.amount
        });
    }

    return opportunity;
};

const getPipeline = async (ownerId) => {
    const opportunities = await Opportunity.find({ owner: ownerId });

    const pipeline = {
        prospecting: [],
        qualification: [],
        proposal: [],
        negotiation: [],
        closed_won: [],
        closed_lost: [],
        totalValue: 0,
        weightedValue: 0
    };

    opportunities.forEach(opp => {
        const stage = opp.stage.toLowerCase();
        if (pipeline[stage]) {
            pipeline[stage].push(opp);
            pipeline.totalValue += opp.amount || 0;
            pipeline.weightedValue += ((opp.amount || 0) * (opp.probability || 0)) / 100;
        }
    });

    return pipeline;
};

module.exports = {
    advanceStage,
    getPipeline
};

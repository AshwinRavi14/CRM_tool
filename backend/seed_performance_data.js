const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Account = require('./src/models/Account');
const Opportunity = require('./src/models/Opportunity');
const Lead = require('./src/models/Lead');
const { generateAccountNumber, generateOpportunityNumber, generateLeadNumber } = require('./src/utils/numberGenerator');

dotenv.config();

const OWNER_ID = '697af18211188d20732217d3';

async function seedPerformanceData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Seed Accounts (300)
        console.log('Seeding 300 accounts...');
        const accounts = [];
        for (let i = 0; i < 300; i++) {
            accounts.push({
                accountNumber: `PERF-ACC-${Date.now()}-${i}`,
                companyName: `Performance Corp ${i}`,
                accountType: i % 3 === 0 ? 'CUSTOMER' : 'PROSPECT',
                industry: i % 2 === 0 ? 'AI_DEVELOPMENT' : 'HEALTHCARE',
                owner: OWNER_ID,
                status: 'ACTIVE'
            });
        }
        const createdAccounts = await Account.insertMany(accounts);
        console.log('✅ 300 accounts seeded');

        // 2. Seed Opportunities (600)
        console.log('Seeding 600 opportunities...');
        const opportunities = [];
        const stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
        for (let i = 0; i < 600; i++) {
            const randomAccount = createdAccounts[Math.floor(Math.random() * createdAccounts.length)];
            opportunities.push({
                opportunityNumber: `PERF-OPP-${Date.now()}-${i}`,
                name: `Deal for ${randomAccount.companyName} - ${i}`,
                account: randomAccount._id,
                stage: stages[i % stages.length],
                amount: Math.floor(Math.random() * 100000) + 10000,
                owner: OWNER_ID,
                probability: (i % 10) * 10
            });
        }
        await Opportunity.insertMany(opportunities);
        console.log('✅ 600 opportunities seeded');

        // 3. Seed Leads (500)
        console.log('Seeding 500 leads...');
        const leads = [];
        for (let i = 0; i < 500; i++) {
            leads.push({
                leadNumber: `PERF-LEAD-${Date.now()}-${i}`,
                firstName: `LeadFirst${i}`,
                lastName: `LeadLast${i}`,
                email: `lead${i}@perf.com`,
                company: `Lead Company ${i}`,
                source: 'WEBSITE',
                owner: OWNER_ID,
                status: 'NEW'
            });
        }
        await Lead.insertMany(leads);
        console.log('✅ 500 leads seeded');

        console.log('\n--- Seeding Completed ---');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedPerformanceData();

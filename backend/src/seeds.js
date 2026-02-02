const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Account = require('./models/Account');
const Contact = require('./models/Contact');
const Opportunity = require('./models/Opportunity');
const Lead = require('./models/Lead');
const User = require('./models/User');
const {
    generateAccountNumber,
    generateOpportunityNumber,
    generateLeadNumber
} = require('./utils/numberGenerator');

const seedData = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // 1. Get the specific user provided by the user
        let user = await User.findOne({ email: 'admin@wersel.ai' });
        if (!user) {
            console.log('User admin@wersel.ai not found. Creating...');
            user = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@wersel.ai',
                password: 'password123',
                role: 'ADMIN',
                isVerified: true
            });
            console.log('Admin user created.');
        }
        console.log(`Using user: ${user.email} (ID: ${user._id}) as owner.`);

        // 2. Clear ALL existing records
        console.log('Performing a FULL WIPE of Leads, Accounts, Contacts, and Opportunities...');
        await Lead.deleteMany({});
        await Opportunity.deleteMany({});
        await Contact.deleteMany({});
        await Account.deleteMany({});
        console.log('Database cleared.');

        console.log('Seeding Leads...');
        const leads = await Lead.create([
            {
                leadNumber: generateLeadNumber(),
                firstName: 'James',
                lastName: 'Wilson',
                email: 'james.wilson@techcorp.com',
                company: 'TechCorp Industries',
                source: 'LINKEDIN',
                status: 'NEW',
                rating: 'HOT',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Sarah',
                lastName: 'Miller',
                email: 'sarah.miller@innovate.io',
                company: 'Innovate AI',
                source: 'WEBSITE',
                status: 'CONTACTED',
                rating: 'WARM',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'm.brown@globalsoft.com',
                company: 'GlobalSoft Systems',
                source: 'REFERRAL',
                status: 'NEW',
                rating: 'COLD',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Emily',
                lastName: 'White',
                email: 'emily.white@cloudnet.net',
                company: 'CloudNet Solutions',
                source: 'CONFERENCE',
                status: 'QUALIFIED',
                rating: 'HOT',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'David',
                lastName: 'Clark',
                email: 'd.clark@datastream.com',
                company: 'DataStream Inc',
                source: 'COLD_CALL',
                status: 'NEW',
                rating: 'WARM',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Lisa',
                lastName: 'Anderson',
                email: 'lisa.a@brightfuture.org',
                company: 'Bright Future EdTech',
                source: 'EMAIL',
                status: 'CONTACTED',
                rating: 'HOT',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Robert',
                lastName: 'Taylor',
                email: 'rtaylor@fintechplus.com',
                company: 'FinTech Plus',
                source: 'WEBSITE',
                status: 'NEW',
                rating: 'WARM',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Nancy',
                lastName: 'Thomas',
                email: 'nancy.t@logistics-pro.com',
                company: 'Logistics Pro',
                source: 'LINKEDIN',
                status: 'QUALIFIED',
                rating: 'HOT',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Kevin',
                lastName: 'Martinez',
                email: 'kmartinez@cyberguard.io',
                company: 'CyberGuard Security',
                source: 'OTHER',
                status: 'NEW',
                rating: 'COLD',
                owner: user._id
            },
            {
                leadNumber: generateLeadNumber(),
                firstName: 'Jennifer',
                lastName: 'Lee',
                email: 'jennifer.lee@biotech-labs.com',
                company: 'BioTech Labs',
                source: 'REFERRAL',
                status: 'CONTACTED',
                rating: 'WARM',
                owner: user._id
            }
        ]);

        console.log('Seeding Accounts...');
        const accounts = await Account.create([
            {
                accountNumber: generateAccountNumber(),
                companyName: 'Quantum Systems AI',
                accountType: 'CUSTOMER',
                industry: 'AI_DEVELOPMENT',
                website: 'https://quantum-sys.ai',
                owner: user._id
            },
            {
                accountNumber: generateAccountNumber(),
                companyName: 'HealthTech Solutions',
                accountType: 'PROSPECT',
                industry: 'HEALTHCARE',
                website: 'https://healthtech.io',
                owner: user._id
            },
            {
                accountNumber: generateAccountNumber(),
                companyName: 'Global Retail Corp',
                accountType: 'CUSTOMER',
                industry: 'RETAIL',
                website: 'https://global-retail.com',
                owner: user._id
            },
            {
                accountNumber: generateAccountNumber(),
                companyName: 'FinEdge Finance',
                accountType: 'PROSPECT',
                industry: 'FINANCE',
                website: 'https://finedge.com',
                owner: user._id
            }
        ]);

        console.log('Seeding Contacts...');
        const contacts = await Contact.create([
            {
                account: accounts[0]._id,
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@quantum-sys.ai',
                phone: '+1-555-0101',
                title: 'CEO',
                isPrimary: true
            },
            {
                account: accounts[1]._id,
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob@healthtech.io',
                phone: '+1-555-0102',
                title: 'CTO',
                isPrimary: true
            },
            {
                account: accounts[2]._id,
                firstName: 'Charlie',
                lastName: 'Davis',
                email: 'charlie@global-retail.com',
                phone: '+1-555-0103',
                title: 'Director of Ops',
                isPrimary: true
            }
        ]);

        console.log('Seeding Opportunities...');
        const createdOpps = await Opportunity.create([
            {
                opportunityNumber: generateOpportunityNumber(),
                name: 'AI Radiology Integration',
                account: accounts[1]._id,
                primaryContact: contacts[1]._id,
                amount: 85000,
                stage: 'PROSPECTING',
                probability: 10,
                owner: user._id,
                expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                opportunityNumber: generateOpportunityNumber(),
                name: 'Enterprise Cloud Migration',
                account: accounts[2]._id,
                primaryContact: contacts[2]._id,
                amount: 150000,
                stage: 'QUALIFICATION',
                probability: 25,
                owner: user._id,
                expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
            },
            {
                opportunityNumber: generateOpportunityNumber(),
                name: 'Predictive Analytics Suite',
                account: accounts[0]._id,
                primaryContact: contacts[0]._id,
                amount: 42000,
                stage: 'PROPOSAL',
                probability: 50,
                owner: user._id,
                expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            },
            {
                opportunityNumber: generateOpportunityNumber(),
                name: 'Supply Chain AI Optimization',
                account: accounts[2]._id,
                primaryContact: contacts[2]._id,
                amount: 75000,
                stage: 'NEGOTIATION',
                probability: 75,
                owner: user._id,
                expectedCloseDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            },
            {
                opportunityNumber: generateOpportunityNumber(),
                name: 'HR Platform Upgrade',
                account: accounts[0]._id,
                primaryContact: contacts[0]._id,
                amount: 28000,
                stage: 'CLOSED_WON',
                probability: 100,
                owner: user._id,
                closedDate: new Date()
            }
        ]);

        console.log(`Summary:
- Leads: ${leads.length}
- Accounts: ${accounts.length}
- Contacts: ${contacts.length}
- Opportunities: ${createdOpps.length}
Seeding completed for ${user.email}`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();

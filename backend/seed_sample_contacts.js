const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Account = require('./src/models/Account');
const Contact = require('./src/models/Contact');
const User = require('./src/models/User');

const sampleContacts = [
    { firstName: 'Alice', lastName: 'Johnson', title: 'CEO', email: 'alice@techcorp.com', phone: '+1 555 0101', isDecisionMaker: true },
    { firstName: 'Bob', lastName: 'Smith', title: 'CTO', email: 'bob@techcorp.com', phone: '+1 555 0102', isDecisionMaker: true },
    { firstName: 'Charlie', lastName: 'Davis', title: 'VP Sales', email: 'charlie@techcorp.com', phone: '+1 555 0103', isDecisionMaker: true },
    { firstName: 'Diana', lastName: 'Evans', title: 'Marketing Mgr', email: 'diana@techcorp.com', phone: '+1 555 0104', isDecisionMaker: false },
    { firstName: 'Evan', lastName: 'Wright', title: 'Developer', email: 'evan@techcorp.com', phone: '+1 555 0105', isDecisionMaker: false }
];

const seedContacts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const targetEmail = 'admin@wersel.ai';
        console.log(`Looking for user: ${targetEmail}...`);

        // 1. Find the specific admin user
        let user = await User.findOne({ email: targetEmail });

        if (!user) {
            console.error(`User ${targetEmail} not found!`);
            console.log("Please ensuring you have registered 'admin@wersel.ai' or checks your database.");
            // Attempt to find ANY admin as fallback or list users
            const allUsers = await User.find({}).limit(5);
            console.log("Available users (first 5):", allUsers.map(u => u.email));
            process.exit(1);
        }

        console.log(`Found User: ${user.email} (${user._id})`);

        // 2. CLEANUP: Delete ALL contacts to ensure clean slate for "other user accounts"
        console.log('Clearing ALL existing contacts...');
        await Contact.deleteMany({});
        console.log('Contacts cleared.');

        // 3. Find or Create Account for Admin
        let account = await Account.findOne({ companyName: 'Wersel Tech Corp', owner: user._id });
        if (!account) {
            console.log(`Creating 'Wersel Tech Corp' account for ${user.email}...`);
            account = await Account.create({
                companyName: 'Wersel Tech Corp',
                accountNumber: `ACC-ADMIN-${Date.now()}`,
                accountType: 'CUSTOMER',
                industry: 'AI_DEVELOPMENT',
                owner: user._id,
                email: 'admin@wersel.ai',
                status: 'ACTIVE'
            });
        }
        console.log(`Using Account: ${account.companyName} (${account._id})`);

        // 4. Create Contacts
        console.log('Seeding 5 sample contacts...');
        const contactsWithAccount = sampleContacts.map(c => ({
            ...c,
            account: account._id
        }));

        await Contact.insertMany(contactsWithAccount);
        console.log(`Successfully created 5 sample contacts for ${targetEmail}!`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding contacts:', err);
        process.exit(1);
    }
};

seedContacts();

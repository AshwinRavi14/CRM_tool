const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Contact = require('./src/models/Contact'); // Adjust path if needed
const Account = require('./src/models/Account');

const listContacts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const contacts = await Contact.find({}).populate('account', 'companyName');
        console.log(`Found ${contacts.length} contacts:`);

        contacts.forEach(c => {
            console.log(`- ${c.firstName} ${c.lastName} | ${c.email} | Account: ${c.account ? c.account.companyName : 'None'}`);
        });

        const accounts = await Account.find({});
        console.log(`Found ${accounts.length} accounts.`);

        process.exit(0);
    } catch (err) {
        console.error('Error listing contacts:', err);
        process.exit(1);
    }
};

listContacts();

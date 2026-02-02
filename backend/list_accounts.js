const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Account = require('./src/models/Account');

const listAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const accounts = await Account.find({});
        console.log(`Found ${accounts.length} accounts:`);
        accounts.forEach(acc => {
            console.log(`- ID: ${acc._id}, Company: ${acc.companyName}, Name: ${acc.name}, Owner: ${acc.owner}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error listing accounts:', err);
        process.exit(1);
    }
};

listAccounts();

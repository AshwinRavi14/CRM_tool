const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Account = require('./src/models/Account');

const checkAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const accounts = await Account.find({});
        console.log('Total Accounts Found:', accounts.length);
        accounts.forEach(acc => {
            console.log(`- ${acc.companyName} (${acc.accountNumber}) | Type: ${acc.accountType} | Owner: ${acc.owner}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkAccounts();

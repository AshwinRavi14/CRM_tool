const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const users = await User.find({}).select('email role status firstName lastName');
        console.log('--- Existing Users ---');
        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | Status: ${u.status} | Name: ${u.firstName} ${u.lastName}`);
        });
        console.log('----------------------');

        process.exit(0);
    } catch (err) {
        console.error('Error listing users:', err);
        process.exit(1);
    }
}

listUsers();

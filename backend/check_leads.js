const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const LeadSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});

const Lead = mongoose.model('Lead', LeadSchema);
const User = mongoose.model('User', UserSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const leads = await Lead.find().populate('owner');
        console.log('--- LEAD OWNERSHIP ---');
        leads.forEach(l => {
            console.log(`Lead: ${l.firstName} ${l.lastName} | Owner: ${l.owner ? l.owner.email : 'UNASSIGNED'}`);
        });
        console.log('----------------------');

        const count = await Lead.countDocuments();
        console.log(`Total Leads in DB: ${count}`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();

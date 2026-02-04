const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Report = require('./models/Report');
const Activity = require('./models/Activity');
const User = require('./models/User');
const Account = require('./models/Account');
const Contact = require('./models/Contact');
const Lead = require('./models/Lead');
const Opportunity = require('./models/Opportunity');

const seedActivityReport = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'admin@wersel.ai' });
        if (!user) {
            console.log('Admin user not found');
            process.exit(1);
        }

        // 1. Create Report Metadata
        const existingReport = await Report.findOne({ name: 'Activities by Salesperson' });
        if (!existingReport) {
            await Report.create({
                name: 'Activities by Salesperson',
                category: 'Activity',
                frequency: 'Real-time',
                format: 'PDF',
                createdBy: user._id
            });
            console.log('Created Activity Report metadata');
        }

        // 2. Create some sample activities if none exist
        const activityCount = await Activity.countDocuments();
        if (activityCount === 0) {
            // Get some related items
            const account = await Account.findOne();
            const contact = await Contact.findOne();
            const lead = await Lead.findOne();
            const opportunity = await Opportunity.findOne();

            const activities = [
                {
                    type: 'TASK',
                    subject: 'Review use cases',
                    priority: 'NORMAL',
                    status: 'COMPLETED',
                    relatedToType: 'Account',
                    relatedToId: account?._id,
                    owner: user._id
                },
                {
                    type: 'CALL',
                    subject: 'Follow Up',
                    priority: 'NORMAL',
                    status: 'COMPLETED',
                    relatedToType: 'Contact',
                    relatedToId: contact?._id,
                    owner: user._id
                },
                {
                    type: 'MEETING',
                    subject: 'Disscustion',
                    priority: 'HIGH',
                    status: 'PLANNED',
                    relatedToType: 'Lead',
                    relatedToId: lead?._id,
                    owner: user._id
                },
                {
                    type: 'TASK',
                    subject: 'Review use cases',
                    priority: 'NORMAL',
                    status: 'COMPLETED',
                    relatedToType: 'Opportunity',
                    relatedToId: opportunity?._id,
                    owner: user._id
                }
            ].filter(a => a.relatedToId); // Only add if we have related items

            if (activities.length > 0) {
                await Activity.insertMany(activities);
                console.log(`Seeded ${activities.length} activities`);
            } else {
                console.log('No related items found to seed activities');
            }
        }

        console.log('Seeding finished');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
};

seedActivityReport();

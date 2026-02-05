const mongoose = require('mongoose');
const User = require('./src/models/User');
const Activity = require('./src/models/Activity');
const Lead = require('./src/models/Lead');
const Contact = require('./src/models/Contact');
const Opportunity = require('./src/models/Opportunity');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        let john = await User.findOne({ firstName: 'John' });
        if (!john) {
            john = await User.findOne(); // Fallback to any user
        }

        if (!john) {
            console.error('No users found to assign activities to');
            process.exit(1);
        }

        console.log(`Assigning activities to user: ${john.firstName} ${john.lastName} (${john._id})`);

        // Create some related entities if they don't exist, or just use dummy IDs
        // For a more robust report, let's create a few Leads and Contacts

        const activities = [
            { subject: 'Review use cases', type: 'TASK', priority: 'NORMAL', relatedToType: 'Lead', relatedToId: new mongoose.Types.ObjectId(), owner: john._id, status: 'PLANNED' },
            { subject: 'Follow Up', type: 'CALL', priority: 'NORMAL', relatedToType: 'Lead', relatedToId: new mongoose.Types.ObjectId(), owner: john._id, status: 'COMPLETED' },
            { subject: 'Discussion', type: 'MEETING', priority: 'NORMAL', relatedToType: 'Contact', relatedToId: new mongoose.Types.ObjectId(), owner: john._id, status: 'PLANNED' },
            { subject: 'Review use cases', type: 'TASK', priority: 'HIGH', relatedToType: 'Opportunity', relatedToId: new mongoose.Types.ObjectId(), owner: john._id, status: 'PLANNED' },
            { subject: 'Initial Discovery', type: 'CALL', priority: 'NORMAL', relatedToType: 'Lead', relatedToId: new mongoose.Types.ObjectId(), owner: john._id, status: 'COMPLETED' }
        ];

        await Activity.deleteMany({ owner: john._id });
        await Activity.insertMany(activities);

        console.log('Successfully seeded 5 activities for the report');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();

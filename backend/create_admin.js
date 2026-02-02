const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@wersel.ai';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`User ${adminEmail} already exists.`);
            // Update password just in case
            existingAdmin.password = 'password123';
            await existingAdmin.save();
            console.log('Password updated for existing admin.');
        } else {
            const admin = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password: 'password123',
                role: 'ADMIN',
                status: 'ACTIVE'
            });

            await admin.save();
            console.log(`Admin user created: ${adminEmail} / password123`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();

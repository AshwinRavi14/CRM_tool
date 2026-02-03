const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const invitationSchema = new mongoose.Schema({
    email: String,
    role: String,
    token: String,
    status: String,
    expiresAt: Date
});

const Invitation = mongoose.model('Invitation', invitationSchema);

async function checkInvitations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const invitations = await Invitation.find();
        console.log('Total Invitations:', invitations.length);

        invitations.forEach(inv => {
            console.log('\n--- Invitation ---');
            console.log('Email:', inv.email);
            console.log('Role:', inv.role);
            console.log('Status:', inv.status);
            console.log('ExpiresAt:', inv.expiresAt);
            console.log('Hashed Token in DB:', inv.token);
            console.log('Expired?', inv.expiresAt < Date.now());
        });

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkInvitations();

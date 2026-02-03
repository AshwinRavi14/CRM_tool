const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'email role');
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`${u.email} : ${u.role}`);
        });
        console.log('-----------------');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();

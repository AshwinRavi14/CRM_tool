const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./src/models/Report');

dotenv.config();

const truncateSales = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Report.deleteMany({ category: 'Sales' });
        console.log(`Deleted ${result.deletedCount} reports from the 'Sales' category.`);

    } catch (error) {
        console.error('Error truncating sales data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
    }
};

truncateSales();

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Report name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Sales', 'Marketing', 'Inventory', 'Activity', 'Performance'],
        required: [true, 'Category is required']
    },
    frequency: {
        type: String,
        enum: ['Real-time', 'Daily', 'Weekly', 'Monthly'],
        default: 'Weekly'
    },
    format: {
        type: String,
        enum: ['PDF', 'Excel', 'CSV'],
        default: 'PDF'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastRun: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);

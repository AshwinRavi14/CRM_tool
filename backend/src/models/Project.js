const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a project name'],
        trim: true
    },
    account: {
        type: String,
        required: [true, 'Please provide an account name'],
        trim: true
    },
    manager: {
        type: String,
        required: [true, 'Please provide a manager name'],
        trim: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'],
        default: 'NOT_STARTED'
    },
    dueDate: {
        type: Date
    },
    phases: {
        type: [{
            name: { type: String, required: true },
            status: {
                type: String,
                enum: ['Pending', 'In Progress', 'Completed'],
                default: 'Pending'
            },
            documentation: { type: String },
            report: { type: String },
            updatedAt: { type: Date, default: Date.now }
        }],
        default: [
            { name: 'Planning', status: 'In Progress' },
            { name: 'Data Prep', status: 'Pending' },
            { name: 'Model Dev', status: 'Pending' },
            { name: 'Validation', status: 'Pending' },
            { name: 'Deployment', status: 'Pending' }
        ]
    },
    models: [{
        name: { type: String, required: true },
        version: { type: String, default: '1.0.0' },
        accuracy: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);

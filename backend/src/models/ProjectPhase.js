const mongoose = require('mongoose');

const projectPhaseSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    phaseName: {
        type: String,
        required: [true, 'Phase name is required'],
        trim: true
    },
    phaseType: {
        type: String,
        enum: ['PLANNING', 'DATA_PREP', 'MODEL_DEV', 'VALIDATION', 'DEPLOYMENT', 'MAINTENANCE'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        default: 'PENDING'
    },
    startDate: Date,
    endDate: Date,
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectPhase', projectPhaseSchema);

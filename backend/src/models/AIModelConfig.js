const mongoose = require('mongoose');

const aiModelConfigSchema = new mongoose.Schema({
    modelName: {
        type: String,
        required: [true, 'Model name is required'],
        trim: true
    },
    modelType: {
        type: String,
        enum: ['FNN', 'CNN', 'U-Net', 'SVM', 'LSTM', 'TRANSFORMER', 'OTHER'],
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    description: String,
    inputDataType: String,
    metrics: {
        accuracy: { type: Number, default: 0 },
        precision: { type: Number, default: 0 },
        recall: { type: Number, default: 0 },
        f1Score: { type: Number, default: 0 }
    },
    trainingApproach: String,
    status: {
        type: String,
        enum: ['TRAINING', 'VALIDATION', 'DEPLOYED', 'DEPRECATED'],
        default: 'TRAINING'
    },
    deploymentURL: String,
    githubRepoURL: String,
    deploymentDate: Date,
}, {
    timestamps: true
});

module.exports = mongoose.model('AIModelConfig', aiModelConfigSchema);

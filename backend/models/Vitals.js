const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    patientId: {
        type: String, // Change from ObjectId to String to store userId
        required: true,
    },
    bodyTemperature: {
        type: Number,
        required: true,
    },
    heartRate: {
        type: Number,
        required: true,
    },
    bloodPressure: {
        type: String,
        required: true,
    },
    respiratoryRate: {
        type: Number,
        required: true,
    },
    recordedBy: {
        type: String, // Change from ObjectId to String to store userId of the nurse
        required: true,
    },
    recordedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Vital', vitalSchema);

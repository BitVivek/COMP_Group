const mongoose = require('mongoose');

const dailyMetricSchema = new mongoose.Schema({
    patientId: {
        type: String, // Change from ObjectId to String
        required: true,
    },
    pulseRate: {
        type: Number,
        required: true,
    },
    bloodPressure: {
        type: String, // e.g., "120/80"
        required: true,
    },
    weight: {
        type: Number, // Weight in kg
        required: true,
    },
    temperature: {
        type: Number, // Temperature in Celsius
        required: true,
    },
    respiratoryRate: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DailyMetric', dailyMetricSchema);

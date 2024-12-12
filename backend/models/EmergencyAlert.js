const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    respondersNotified: {
        type: Boolean,
        default: false, // For future notification integration
    },
});

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);

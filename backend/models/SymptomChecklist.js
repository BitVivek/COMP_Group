const mongoose = require('mongoose');

const symptomChecklistSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    symptoms: [
        {
            type: String,
            required: true,
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SymptomChecklist', symptomChecklistSchema);

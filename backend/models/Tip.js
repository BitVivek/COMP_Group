const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
    },
    tip: {
        type: String,
        required: true,
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Nurse (User model)
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Tip', tipSchema);

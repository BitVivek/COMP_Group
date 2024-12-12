const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const EmergencyAlert = require('../models/EmergencyAlert');
const DailyMetric = require('../models/DailyMetrics');
const SymptomChecklist = require('../models/SymptomChecklist');
const Tip = require('../models/Tip');

const router = express.Router();

// Create an emergency alert (Patient only)
router.post('/emergency-alert', protect, authorize('patient'), async (req, res) => {
    try {
        const { message } = req.body;

        const alert = await EmergencyAlert.create({
            patientId: req.user.id,
            message,
        });

        res.status(201).json({ message: 'Emergency alert created successfully', alert });
    } catch (error) {
        console.error('Error creating emergency alert:', error);
        res.status(500).json({ message: 'Error creating emergency alert', error: error.message });
    }
});


router.post('/daily-metrics', protect, authorize('patient'), async (req, res) => {
    try {
        const { pulseRate, bloodPressure, weight, temperature, respiratoryRate } = req.body;

        // Delete any existing daily metrics for the patient
        await DailyMetric.deleteMany({ patientId: req.user.userId }); // Delete metrics based on userId

        // Save the new daily metrics
        const dailyMetric = await DailyMetric.create({
            patientId: req.user.userId, // Use userId instead of ObjectId
            pulseRate,
            bloodPressure,
            weight,
            temperature,
            respiratoryRate,
        });

        res.status(201).json({ message: 'Daily metrics recorded successfully', dailyMetric });
    } catch (error) {
        console.error('Error saving daily metrics:', error);
        res.status(500).json({ message: 'Error saving daily metrics', error: error.message });
    }
});


router.post('/symptoms', protect, authorize('patient'), async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        // Save the symptoms
        const symptomChecklist = await SymptomChecklist.create({
            patientId: req.user.id, // Get patient ID from the token
            symptoms,
        });

        res.status(201).json({ message: 'Symptoms submitted successfully', symptomChecklist });
    } catch (error) {
        res.status(500).json({ message: 'Error saving symptoms', error: error.message });
    }
});

router.get('/tips', protect, authorize('patient'), async (req, res) => {
    try {
        const tips = await Tip.find({ patientId: req.user.id }).sort({ date: -1 }); // Fetch tips for the logged-in patient
        res.status(200).json({ tips });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tips', error: error.message });
    }
});


module.exports = router;

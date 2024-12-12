const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Vital = require('../models/Vitals');
const User = require('../models/User'); // Ensure this line is present
const Tip = require('../models/Tip');
const OpenAI = require('openai');
const DailyMetric = require('../models/DailyMetrics'); // Import the DailyMetric model
const EmergencyAlert = require('../models/EmergencyAlert');
const SymptomChecklist = require('../models/SymptomChecklist');


const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

// Add vital signs for a patient (Nurse only)
router.post('/vitals/:userId', protect, authorize('nurse'), async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the ObjectId of the user with the given userId
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const { bodyTemperature, heartRate, bloodPressure, respiratoryRate } = req.body;

        // Save vital signs to the database
        const vital = await Vital.create({
            patientId: user._id, // Use the ObjectId from the User document
            bodyTemperature,
            heartRate,
            bloodPressure,
            respiratoryRate,
            recordedBy: req.user.id, // Nurse's ObjectId
        });

        res.status(201).json({ message: 'Vital signs recorded successfully', vital });
    } catch (error) {
        res.status(500).json({ message: 'Error saving vital signs', error: error.message });
    }
});

// Get vital signs for a patient (Nurse only)
router.get('/vitals/:userId', protect, authorize('nurse'), async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch vital signs directly using the userId (now stored as patientId)
        const vitals = await Vital.find({ patientId: userId });

        if (!vitals || vitals.length === 0) {
            return res.status(404).json({ message: 'No vitals found for this patient' });
        }

        res.status(200).json({ message: 'Vitals retrieved successfully', vitals });
    } catch (error) {
        console.error('Error retrieving vital signs:', error);
        res.status(500).json({ message: 'Error retrieving vital signs', error: error.message });
    }
});




// Add a daily motivational tip for a patient (Nurse only)
router.post('/tips/:patientId', protect, authorize('nurse'), async (req, res) => {
    try {
        const { patientId } = req.params;

        // Find the patient's ObjectId using the userId
        const user = await User.findOne({ userId: patientId });
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Fetch a random tip from the database
        const randomTip = await Tip.aggregate([{ $sample: { size: 1 } }]);

        if (randomTip.length === 0) {
            return res.status(404).json({ message: 'No tips available in the database' });
        }

        // Save the random tip for the specified patient
        const savedTip = await Tip.create({
            patientId: user._id, // Use the patient's ObjectId
            tip: randomTip[0].tip,
            sentBy: req.user.id, // Nurse's ObjectId
        });

        res.status(201).json({
            message: 'Motivational tip sent successfully',
            motivationalTip: savedTip,
        });
    } catch (error) {
        console.error('Error sending motivational tip:', error);
        res.status(500).json({ message: 'Error sending motivational tip', error: error.message });
    }
});

router.get('/latest-vitals/:userId', protect, authorize('nurse'), async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the patient's ObjectId using the userId
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Fetch the latest entry for the patient from DailyMetric
        const latestVitals = await DailyMetric.findOne({ patientId: user.userId })
            .sort({ date: -1 }); // Sort by most recent

        if (!latestVitals) {
            return res.status(404).json({ message: 'No vitals found for this patient' });
        }

        res.status(200).json({ message: 'Latest vitals retrieved successfully', latestVitals });
    } catch (error) {
        console.error('Error retrieving latest vitals:', error);
        res.status(500).json({ message: 'Error retrieving latest vitals', error: error.message });
    }
});

router.get('/patients', protect, authorize('nurse'), async (req, res) => {
    try {
        // Fetch all patients
        const patients = await User.find({ role: 'patient' }).select('name userId');

        // For each patient, fetch their symptoms
        const updatedPatients = await Promise.all(
            patients.map(async (patient) => {
                // Find the user's ObjectId by userId
                const user = await User.findOne({ userId: patient.userId });
                if (!user) {
                    // If no user found, return the patient as is, with empty symptoms array
                    return { ...patient.toObject(), symptoms: [] };
                }

                // Fetch all symptom documents for this patient
                const symptomDocs = await SymptomChecklist.find({ patientId: user._id });
                
                // Combine all symptoms into a single array
                let allSymptoms = [];
                for (let doc of symptomDocs) {
                    allSymptoms = allSymptoms.concat(doc.symptoms);
                }

                return { ...patient.toObject(), symptoms: allSymptoms };
            })
        );

        res.status(200).json({ patients: updatedPatients });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
});



// Fetch all emergency alerts for the nurse
router.get('/emergency-alerts', protect, authorize('nurse'), async (req, res) => {
    try {
        const alerts = await EmergencyAlert.find()
            .populate('patientId', 'name userId') // Populate patient details
            .sort({ createdAt: -1 }); // Sort by newest first

        const formattedAlerts = alerts.map(alert => ({
            _id: alert._id,
            message: alert.message,
            patientName: alert.patientId.name,
            patientUserId: alert.patientId.userId,
            date: alert.createdAt,
        }));

        res.status(200).json({ alerts: formattedAlerts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching emergency alerts', error: error.message });
    }
});

router.delete('/emergency-alerts/:alertId', protect, authorize('nurse'), async (req, res) => {
    try {
        const { alertId } = req.params;

        await EmergencyAlert.findByIdAndDelete(alertId);

        res.status(200).json({ message: 'Emergency alert resolved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resolving emergency alert', error: error.message });
    }
});






router.post('/analysis', protect, authorize('nurse'), async (req, res) => {
    try {
        const { symptoms, patientInfo } = req.body;

        // Construct a prompt for OpenAI
        const prompt = `As a medical professional, analyze the following symptoms and provide possible medical conditions and recommendations. Please format the response as JSON.
        
Patient Symptoms: ${symptoms.join(', ')}
${patientInfo ? `Additional Patient Information: ${patientInfo}` : ''}

Please provide:
1. A list of possible conditions (maximum 5)
2. Recommendations for each condition
3. General precautions
4. Whether immediate medical attention is recommended`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a medical analysis assistant providing preliminary analysis of symptoms. Always be cautious and recommend professional medical consultation when appropriate."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        // Parse the response
        const analysis = JSON.parse(completion.choices[0].message.content);

        // Save analysis to database (optional)
        const analysisRecord = await Analysis.create({
            nurseId: req.user.userId,
            symptoms,
            analysis: analysis,
            timestamp: new Date()
        });

        res.status(200).json({
            message: 'Medical condition analysis complete',
            analysisId: analysisRecord._id,
            symptoms,
            analysis,
            timestamp: analysisRecord.timestamp
        });

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ 
            message: 'Error performing medical analysis', 
            error: error.message 
        });
    }
});

module.exports = router;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const SymptomChecklist = () => {
    const navigate = useNavigate();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');

    const symptomsList = [
        'Fever',
        'Cough',
        'Shortness of breath',
        'Fatigue',
        'Muscle pain',
        'Headache',
        'Loss of taste or smell',
        'Sore throat',
        'Congestion or runny nose',
        'Nausea or vomiting',
        'Diarrhea',
    ];

    const handleSymptomChange = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');

        try {
            const response = await axios.post(
                'http://localhost:5001/api/patient/symptoms',
                { symptoms: selectedSymptoms },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setResponseMessage('Symptoms submitted successfully!');
        } catch (error) {
            setResponseMessage(error.response?.data?.message || 'Error submitting symptoms');
        }
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/patient')}>
                Back to Dashboard
            </button>
            <h2>Submit Symptoms</h2>
            <form onSubmit={handleSubmit}>
                <div className="checkbox-list">
                    {symptomsList.map((symptom) => (
                        <label key={symptom} className="checkbox-item">
                            <input
                                type="checkbox"
                                value={symptom}
                                checked={selectedSymptoms.includes(symptom)}
                                onChange={() => handleSymptomChange(symptom)}
                            />
                            {symptom}
                        </label>
                    ))}
                </div>
                <button type="submit">Submit Symptoms</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default SymptomChecklist;

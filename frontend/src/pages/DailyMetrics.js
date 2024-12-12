import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const DailyMetrics = () => {
    const [pulseRate, setPulseRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [weight, setWeight] = useState('');
    const [temperature, setTemperature] = useState('');
    const [respiratoryRate, setRespiratoryRate] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');

        try {
            const response = await axios.post(
                'http://localhost:5001/api/patient/daily-metrics',
                { pulseRate, bloodPressure, weight, temperature, respiratoryRate },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setResponseMessage('Daily metrics submitted successfully!');
        } catch (error) {
            setResponseMessage(error.response?.data?.message || 'Error submitting daily metrics');
        }
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/patient')}>
                Back to Dashboard
            </button>
            <h2>Submit Daily Metrics</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Pulse Rate"
                    value={pulseRate}
                    onChange={(e) => setPulseRate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Blood Pressure"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Temperature (°C)"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Respiratory Rate"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default DailyMetrics;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PatientDashboard.css';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [tip, setTip] = useState(null);
    const [message, setMessage] = useState('');

    // Fetch motivational tips when the page loads
    useEffect(() => {
        const fetchTip = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/patient/tips', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Select the most recent tip or random tip
                if (response.data.tips.length > 0) {
                    setTip(response.data.tips[0]); // Most recent tip
                }
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching motivational tips');
            }
        };

        fetchTip();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Patient Dashboard</h1>
            <div className="task-buttons">
                <button onClick={() => navigate('/patient/emergency-alert')} className="dashboard-button">
                    Emergency Alert
                </button>
                <button onClick={() => navigate('/patient/daily-metrics')} className="dashboard-button">
                    Submit Daily Metrics
                </button>
                <button onClick={() => navigate('/patient/symptoms')} className="dashboard-button">
                    Submit Symptoms
                </button>
            </div>
            <div className="tips-section">
                <h2>Motivational Tip</h2>
                {message && <p>{message}</p>}
                {tip ? (
                    <div className="motivational-tip">
                        <p><strong>{tip.tip}</strong></p>
                        <small><em>Received on: {new Date(tip.date).toLocaleString()}</em></small>
                    </div>
                ) : (
                    <p>No motivational tip available.</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;

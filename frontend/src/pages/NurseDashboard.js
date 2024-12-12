import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/NurseDashboard.css';

const NurseDashboard = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch emergency alerts when the page loads
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/nurse/emergency-alerts', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAlerts(response.data.alerts); // Set fetched alerts
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching emergency alerts');
            }
        };

        fetchAlerts();
    }, []);

    // Handle resolving an alert
    const handleResolve = async (alertId) => {
        try {
            await axios.delete(`http://localhost:5001/api/nurse/emergency-alerts/${alertId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setAlerts(alerts.filter(alert => alert._id !== alertId)); // Remove resolved alert from the list
            setMessage('Alert resolved successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error resolving alert');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Nurse Dashboard</h1>
            <div className="task-buttons">
                <button onClick={() => navigate('/nurse/add-vitals')} className="dashboard-button">
                    Add Vitals
                </button>
                <button onClick={() => navigate('/nurse/view-vitals')} className="dashboard-button">
                    View Vitals
                </button>
                <button onClick={() => navigate('/nurse/send-tips')} className="dashboard-button">
                    Send Motivational Tips
                </button>
                <button onClick={() => navigate('/nurse/analysis')} className="dashboard-button">
                    Medical Analysis
                </button>
            </div>
            <div className="alerts-section">
                <h2>Emergency Alerts</h2>
                {message && <p>{message}</p>}
                {alerts.length > 0 ? (
                    <ul>
                        {alerts.map(alert => (
                            <li key={alert._id} className="alert-card">
                                <p><strong>Message:</strong> {alert.message}</p>
                                <p><strong>Patient:</strong> {alert.patientName}</p>
                                <p><small><em>Received on: {new Date(alert.date).toLocaleString()}</em></small></p>
                                <button onClick={() => handleResolve(alert._id)}>Resolve</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No emergency alerts available.</p>
                )}
            </div>
        </div>
    );
};

export default NurseDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const SendTips = () => {
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all patients from the database
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/nurse/patients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPatients(response.data.patients);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleSendTip = async () => {
        setMessage('');

        try {
            await axios.post(
                `http://localhost:5001/api/nurse/tips/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setMessage('Tip sent successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error sending tip');
        }
    };

    const handleSelectPatient = (patientId) => {
        setUserId(patientId);
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/nurse')}>
                Back to Dashboard
            </button>
            <h2>Send Motivational Tips</h2>
            <div className="content">
                <div className="form-section">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Patient User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleSendTip}>Send Tip</button>
                    {message && <p>{message}</p>}
                </div>
                <div className="patient-list-section">
                    <h3>Patients</h3>
                    <ul className="patient-list">
                        {patients.map((patient) => (
                            <li
                                key={patient.userId}
                                onClick={() => handleSelectPatient(patient.userId)}
                                className="patient-item"
                            >
                                {patient.name} ({patient.userId})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SendTips;

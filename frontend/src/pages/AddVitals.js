import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const AddVitals = () => {
    const [userId, setUserId] = useState('');
    const [bodyTemperature, setBodyTemperature] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [respiratoryRate, setRespiratoryRate] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(
                `http://localhost:5001/api/nurse/vitals/${userId}`,
                { bodyTemperature, heartRate, bloodPressure, respiratoryRate },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setMessage('Vitals added successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding vitals');
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
            <h2>Add Vitals</h2>
            <div className="content">
                <div className="form-section">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Patient User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Body Temperature"
                            value={bodyTemperature}
                            onChange={(e) => setBodyTemperature(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Heart Rate"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
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
                            placeholder="Respiratory Rate"
                            value={respiratoryRate}
                            onChange={(e) => setRespiratoryRate(e.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
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

export default AddVitals;

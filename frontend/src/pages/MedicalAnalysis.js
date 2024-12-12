import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const MedicalAnalysis = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSymptoms, setPatientSymptoms] = useState([]);
    const [symptoms, setSymptoms] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch all patients on component load
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/nurse/patients', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPatients(response.data.patients);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching patients');
            }
        };

        fetchPatients();
    }, []);

    // Fetch symptoms for a selected patient
    const fetchSymptoms = async (userId) => {
        setMessage('');
        setPatientSymptoms([]);
        setSelectedPatient(null);

        try {
            const response = await axios.get(`http://localhost:5001/api/nurse/symptoms/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setPatientSymptoms(response.data.symptoms);
            setSelectedPatient(patients.find((patient) => patient.userId === userId));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error fetching symptoms');
        }
    };

    // Analyze symptoms using AI
    const handleAnalyze = async () => {
        if (!selectedPatient || patientSymptoms.length === 0) {
            setMessage('No symptoms to analyze.');
            return;
        }

        setMessage('');
        setAnalysis(null);

        try {
            const response = await axios.post(
                'http://localhost:5001/api/nurse/analysis',
                { symptoms: patientSymptoms },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setAnalysis(response.data.analysis);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error performing analysis');
        }
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/nurse')}>
                Back to Dashboard
            </button>
            <h2>Medical Analysis</h2>
            {message && <p>{message}</p>}

            <div className="tables-section">
                <div className="patient-list-section">
                    <h3>Patients</h3>
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>User ID</th>
                                <th>Symptoms (Summary)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.userId} onClick={() => fetchSymptoms(patient.userId)}>
                                    <td>{patient.name}</td>
                                    <td>{patient.userId}</td>
                                    <td>
                                        {patient.symptoms && patient.symptoms.length > 0
                                            ? patient.symptoms.join(', ')
                                            : 'No symptoms'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedPatient && (
                    <div className="symptoms-list-section">
                        <h3>Symptoms for {selectedPatient.name}</h3>
                        <table className="symptoms-table">
                            <thead>
                                <tr>
                                    <th>Symptoms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientSymptoms.length > 0 ? (
                                    patientSymptoms.map((symptom, index) => (
                                        <tr key={index}>
                                            <td>{symptom}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td>No symptoms found for this patient.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <textarea
                placeholder="Enter additional symptoms separated by commas"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />
            <button onClick={handleAnalyze}>Analyze</button>

            {analysis && (
                <div className="analysis-result">
                    <h3>Analysis Result:</h3>
                    <pre>{JSON.stringify(analysis, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default MedicalAnalysis;

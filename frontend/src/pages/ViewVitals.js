import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const ViewVitals = () => {
    const [userId, setUserId] = useState('');
    const [patientVitals, setPatientVitals] = useState([]); // Vitals entered by the patient
    const [nurseVitals, setNurseVitals] = useState([]); // Vitals entered by the nurse
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFetchVitals = async () => {
        setMessage('');
        setPatientVitals([]);
        setNurseVitals([]);

        try {
            // Fetch patient-entered vitals from DailyMetrics
            const patientResponse = await axios.get(`http://localhost:5001/api/nurse/latest-vitals/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Fetch nurse-entered vitals
            const nurseResponse = await axios.get(`http://localhost:5001/api/nurse/vitals/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setPatientVitals([patientResponse.data.latestVitals]); // Wrap in array to maintain structure
            setNurseVitals(nurseResponse.data.vitals);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error fetching vitals');
        }
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/nurse')}>
                Back to Dashboard
            </button>
            <h2>View Vitals</h2>
            <input
                type="text"
                placeholder="Patient User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleFetchVitals}>Fetch Vitals</button>
            {message && <p>{message}</p>}
            <div className="vitals-grid">
                <div className="vitals-column">
                    <h3>Patient-Entered Vitals</h3>
                    {patientVitals.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Temperature</th>
                                    <th>Pulse Rate</th>
                                    <th>Blood Pressure</th>
                                    <th>Resp Rate</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientVitals.map((vital, index) => (
                                    <tr key={index}>
                                        <td>{vital.temperature}</td>
                                        <td>{vital.pulseRate}</td>
                                        <td>{vital.bloodPressure}</td>
                                        <td>{vital.respiratoryRate}</td>
                                        <td>{vital.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No patient vitals found</p>
                    )}
                </div>
                <div className="vitals-column">
                    <h3>Nurse-Entered Vitals</h3>
                    {nurseVitals.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Body Temp</th>
                                    <th>Heart Rate</th>
                                    <th>Blood Pressure</th>
                                    <th>Resp Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nurseVitals.map((vital, index) => (
                                    <tr key={index}>
                                        <td>{vital.bodyTemperature}</td>
                                        <td>{vital.heartRate}</td>
                                        <td>{vital.bloodPressure}</td>
                                        <td>{vital.respiratoryRate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No nurse vitals found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewVitals;

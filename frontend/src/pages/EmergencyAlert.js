import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.css';

const EmergencyAlert = () => {
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage('');

        try {
            const response = await axios.post(
                'http://localhost:5001/api/patient/emergency-alert',
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setResponseMessage('Emergency alert sent successfully!');
        } catch (error) {
            setResponseMessage(error.response?.data?.message || 'Error sending emergency alert');
        }
    };

    return (
        <div className="form-container">
            <button className="back-button" onClick={() => navigate('/patient')}>
                Back to Dashboard
            </button>
            <h2>Emergency Alert</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter your emergency message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <button type="submit">Send Alert</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default EmergencyAlert;

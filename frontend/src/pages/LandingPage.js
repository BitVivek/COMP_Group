import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // Ensure this file exists

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-header">
                <h1>Nurse Monitoring</h1>
                <p>Empowering nurses and patients with seamless monitoring and communication.</p>
            </div>
            <div className="button-group">
                <button className="landing-button" onClick={() => navigate('/login')}>
                    Login
                </button>
                <button className="landing-button" onClick={() => navigate('/register')}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default LandingPage;

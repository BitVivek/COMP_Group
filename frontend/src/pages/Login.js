import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import '../styles/Login.css'; // Import CSS for styling

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient'); // Default to patient role
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize navigate


    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
                role,
            });

            // Save token to localStorage and handle response
            localStorage.setItem('token', response.data.token);

            setSuccess('Login successful!');
            console.log('Response:', response.data);
            console.log( response.data.user.role);
            // Redirect based on role
            if (response.data.user.role === 'nurse') {
                

                navigate('/nurse'); // Redirect to NurseDashboard
            } else if (response.data.user.role === 'patient') {
                navigate('/patient'); // Redirect to PatientDashboard (if applicable)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error logging in');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="patient">Patient</option>
                        <option value="nurse">Nurse</option>
                    </select>
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;

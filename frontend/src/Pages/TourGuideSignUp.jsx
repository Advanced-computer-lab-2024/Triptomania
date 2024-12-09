import React, { useState } from 'react';
import './TourGuideSignUp.css'; // Use consistent styling
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';

const TourGuideSignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        yearsOfExperience: '',
        previousWork: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // Added state for success message

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false); // Reset success state

        try {
            const storedData = JSON.parse(localStorage.getItem('tourGuideData')) || {};
            const tourGuideData = {
                ...formData,
                username: storedData.username || '',
                email: storedData.email || '',
                password: storedData.password || '',
            };

            const response = await axiosInstance.post(
                '/api/tourguide/addTourGuide',
                tourGuideData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setSuccess(true); // Display success message
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'An error occurred during sign-up.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Tour Guide Sign-Up</h1>
                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your mobile number"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your years of experience"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="previousWork"
                            value={formData.previousWork || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your previous work"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button" onClick={() => navigate('/tourGuide/uploadDocument')}>Sign Up</button>
                </form>
                {success && (
                    <div className="success-message">
                        <p>
                            Sign-up successful!{' '}
                            <span onClick={() => navigate('/login')} className="login-link">
                                Please Log in
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourGuideSignUp;

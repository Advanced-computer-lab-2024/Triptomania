import React, { useState } from 'react';
import './TourGuideSignUp.css';
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
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
    
        try {
            const storedData = JSON.parse(localStorage.getItem('tourGuideData')) || {};
            const tourGuideData = {
                ...formData,
                username: storedData.username || '',
                email: storedData.email || '',
                password: storedData.password || '',
            };
    
            console.log('Sending signup data:', tourGuideData);
    
            const response = await axiosInstance.post(
                '/api/tourguide/addTourGuide',
                tourGuideData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
    
            console.log('Signup response:', response.data);
    
            if (response.data && response.data._id) {
                const tourGuideId = response.data._id;
                console.log('Tour Guide ID received:', tourGuideId);
                
                // Store data in localStorage
                localStorage.setItem('tourGuideId', tourGuideId);
                localStorage.setItem('tourGuideData', JSON.stringify(response.data));
                
                // Verify storage
                console.log('Stored tourGuideId:', localStorage.getItem('tourGuideId'));
                
                setSuccess(true);
                
                // Navigate with state
                navigate('/tourGuide/uploadDocument', { 
                    state: { tourGuideId } 
                });
            } else {
                setError('Failed to get tour guide ID from response');
            }
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
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter your mobile number"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            required
                            placeholder="Enter years of experience"
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="previousWork"
                            value={formData.previousWork}
                            onChange={handleChange}
                            required
                            placeholder="Enter your previous work experience"
                            className="textarea"
                        ></textarea>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                {success && (
                    <div className="success-message">
                        <p>Sign-up successful! Redirecting to document upload...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourGuideSignUp;
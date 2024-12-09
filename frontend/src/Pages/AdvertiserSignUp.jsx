import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance.js';
import './AdvertiserSignUp.css';
import { useNavigate } from 'react-router-dom';

const AdvertiserSignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('advertiserData');
        return savedData ? JSON.parse(savedData) : {};
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
            // Convert companyHotline to number
            const requestData = {
                ...formData,
                companyHotline: Number(formData.companyHotline)
            };

            const response = await axiosInstance.post('/api/advertiser/addAdvertiser', requestData);
            
            if (response.data && response.data._id) {
                // Store advertiser data in localStorage
                localStorage.setItem('advertiserId', response.data._id);
                localStorage.setItem('advertiserData', JSON.stringify(response.data));
                
                setSuccess(true);
                
                // Navigate to document upload page after 2 seconds
                setTimeout(() => {
                    navigate('/advertiser/uploadDocument', {
                        state: {
                            advertiserId: response.data._id,
                            advertiserData: response.data
                        }
                    });
                }, 2000);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'An error occurred during sign-up.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Advertiser Info</h1>
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
                            name="companyName"
                            value={formData.companyName || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your company name"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="companyHotline"
                            value={formData.companyHotline || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your company hotline"
                            pattern="\d*" // Only allow numbers
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your company website"
                        />
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

export default AdvertiserSignUp;
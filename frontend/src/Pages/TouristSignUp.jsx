import React, { useState } from 'react';
import './TouristSignUp.css'; // Use consistent styling
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';

const TouristSignUp = () => {
    const navigate = useNavigate();
    const [touristId, setTouristId] = useState(null); // Added state for tourist ID

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        nationality: '',
        DOB: '',
        job_Student: '',
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
            const storedData = JSON.parse(localStorage.getItem('touristData')) || {};
            const touristData = {
                ...formData,
                username: storedData.username || '',
                email: storedData.email || '',
                password: storedData.password || '',
            };

            const response = await axiosInstance.post(
                '/api/tourist/addTourist',
                touristData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setTouristId(response.data._id); // Store tourist ID in state
            setSuccess(true); // Display success message
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'An error occurred during sign-up.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Tourist Sign-Up</h1>
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
                            name="nationality"
                            value={formData.nationality || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your nationality"
                        />
                    </div>
                    <div className="form-group">
                        <label className="dob-label">Date of Birth</label>
                        <input
                            type="date"
                            name="DOB"
                            value={formData.DOB || ''}
                            onChange={handleChange}
                            required
                            className="dob-input"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="job_Student"
                            value={formData.job_Student || ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter your job or student status"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                {success && (
                    <div className="success-message">
                        <p>
                            Sign-up successful!{' '}
                            <span onClick={() => navigate('/tourist/preferences', {
                                state: { touristId: touristId }
                            })} className="login-link">
                                Continue Signup
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TouristSignUp;

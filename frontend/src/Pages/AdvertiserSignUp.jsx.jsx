import React, { useState } from 'react';
import axios from 'axios';
import './AdvertiserSignUp.css';
import { useNavigate } from 'react-router-dom';

const AdvertiserSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('advertiserData');
    return savedData ? JSON.parse(savedData) : {};
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
      console.log('Sending advertiser signup data:', formData);
      const response = await axios.post('http://localhost:5000/api/advertiser/addAdvertiser', formData);

      console.log('Signup response:', response);
      setSuccess(true); // Display success message
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

export default AdvertiserSignUp;

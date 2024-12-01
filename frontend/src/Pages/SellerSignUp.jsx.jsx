import React, { useState } from 'react';
import './SellerSignUp.css'; // Use consistent styling
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';

const SellerSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    description: '',
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
      console.log('Sending seller signup data:', formData);

      // Ensure no extra headers are sent
      const response = await axiosInstance.post(
        '/api/seller/addSeller',
        formData,
        {
          headers: { 'Content-Type': 'application/json' }, // Ensure only necessary headers are included
        }
      );

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
        <h1>Seller Sign-Up</h1>
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
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              required
              placeholder="Enter your password"
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
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              placeholder="Enter a brief description"
              className="textarea"
            ></textarea>
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

export default SellerSignUp;

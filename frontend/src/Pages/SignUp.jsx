import React, { useState } from 'react';
import axios from 'axios';
import  './SignUp.css'; 
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.type === 'advertiser') {
      // Save the general form data to local storage and navigate to the next page
      localStorage.setItem('advertiserData', JSON.stringify(formData));
      navigate('/advertisersign-up');
    }
      else if(formData.type === 'admin'){
        localStorage.setItem('adminData', JSON.stringify(formData));
        navigate('/adminsign-up'); 
      }
        else if(formData.type === 'seller'){
            localStorage.setItem('sellerData', JSON.stringify(formData));
            navigate('/sellersign-up'); 

      }else {
      // Handle sign-up for other user types directly
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    setError('');

    try {
      console.log('Sending signup data:', formData);
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);

      console.log('Signup response:', response);
      alert('Sign-up successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Triptomania</h1>
        <form onSubmit={handleNext}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <div className="form-group flex-container">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="dropdown-menu"
            >
              <option value="" disabled>Select user type</option>
              <option value="admin">Admin</option>
              <option value="advertiser">Advertiser</option>
              <option value="seller">Seller</option>
              <option value="tour-guide">Tour Guide</option>
              <option value="tourism-governor">Tourism Governor</option>
              <option value="tourist">Tourist</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">Next</button>
        </form>
        <p
          className="already-account"
          onClick={() => navigate('/login')}
        >
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
};

export default SignUp;

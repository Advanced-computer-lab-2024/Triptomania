import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(''); // State to store selected user type
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        type, 
      });
      alert('Login successful!');
      console.log('User data:', response.data);
      navigate('/viewProducts');
    } catch (err) {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Triptomania</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group flex-container">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
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
            <p
              className="forgot-password"
              onClick={() => navigate('/reset-password')}
            >
              Forgot Password?
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
          <p
            className="signup-button"
            // Uncomment below if you want to enable navigation
            // onClick={() => navigate('/sign-up')}
          >
            Don't have an account? Sign up
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './newPassword.module.css';
import '../../index.css';

const NewPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const { username, type } = location.state || {};  // Get username and type from previous page

  useEffect(() => {
    if (!username || !type) {
      navigate('/auth/requestOtp'); // Redirect to login if username or type is missing
    }
  }, [username, type, navigate]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await axiosInstance.put('/api/auth/changeForgotPassword', {
        username: username,
        type: type,
        newPassword: password,
      });
      if (response.status === 200) {
        alert('Password updated successfully!');
        navigate('/login'); // Navigate to login page after successful password update
      } else {
        setError('Error updating password. Please try again.');
      }
    } catch (err) {
      setError('Error updating password. Please try again later.');
    }
  };

  return (
    <div className={styles['password-container']}>
      <div className={styles['password-box']}>
        <h1>Set New Password</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={styles['password-input']}
              placeholder="Enter your new password"
            />
          </div>
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" className={styles['submit-button']}>Update Password</button>
        </form>
        <p
          className={styles['back-button']}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default NewPasswordPage;

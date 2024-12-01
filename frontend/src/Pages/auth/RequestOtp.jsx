import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import '../../index.css';
import styles from './requestOtp.module.css';

const RequestOtpPage = () => {
  const [username, setUsername] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:5000/api/auth/requestOtp', {
        username,
        type,
      });

      if (response.status === 200) {
        // Navigate to verifyOtp page, passing the username and type as state
        navigate('/auth/verifyOtp', { state: { username, type } });
      } else {
        setError('Error sending OTP. Please try again.');
      }
    } catch (err) {
      setError('Error sending OTP. Please try again.');
    }
  };

  return (
    <div className='request-otp-page-wrapper'>
      <div className={styles['otp-container']}>
        <div className={styles['otp-box']}>
          <h1>Request OTP</h1>
          <form onSubmit={handleSendOtp}>
            <div className={styles['form-group']}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className={styles['form-group']}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className={styles['dropdown-menu']}
              >
                <option value="" disabled>Select user type</option>
                <option value="admin">Admin</option>
                <option value="advertiser">Advertiser</option>
                <option value="seller">Seller</option>
                <option value="tourGuide">Tour Guide</option>
                <option value="tourismGovernor">Tourism Governor</option>
                <option value="tourist">Tourist</option>
              </select>
            </div>
            {error && <p className={styles['error-message']}>{error}</p>}
            <button type="submit" className={styles['send-otp-button']}>Send OTP</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestOtpPage;

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './verifyOtp.module.css';
import '../../index.css';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const { username, type } = location.state || {};  // Get username and type from previous page

  useEffect(() => {
    if (!username || !type) {
      navigate('/auth/requestOtp'); // Redirect if username or type is missing
    }
  }, [username, type, navigate]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Prevent non-numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box if the current box is filled
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('Text');
    if (pastedValue.length === 6 && /^[0-9]+$/.test(pastedValue)) {
      const otpArray = pastedValue.split('');
      setOtp(otpArray);
    } else {
      setError('Please paste a valid 6-digit OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/auth/verifyOTP', {
        username: username,
        type: type,
        otp: otpString,
      });
      if (response.status === 200) {
        navigate('/auth/newPassword', { state: { username, type } }); // Navigate to New Password page
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again later.');
    }
  };

  return (
    <div className={styles['otp-container']}>
      <div className={styles['otp-box']}>
        <h1>Verify OTP</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <div className={styles['otp-inputs']} onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  className={styles['otp-input']}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" className={styles['verify-button']}>Verify OTP</button>
        </form>
        <p
          className={styles['back-button']}
          onClick={() => navigate('/auth/requestOtp')}
        >
          Back to Request OTP
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance';
import '../index.css';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/UserContext.jsx';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(''); // State to store selected user type
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        username,
        password,
        type,
      });
      alert('Login successful!');
      setUser(response.data.user);
      switch (type) {
        case 'admin':
          navigate('/admin/home');
          break;
        case 'advertiser':
        navigate('/advertiser/home');
          break;
        case 'seller':
          navigate('/seller/home');
          break;
        case 'tourGuide':
        navigate('/tourGuide/home');
          break;
        case 'tourismGovernor':
          navigate('/tourismGovernor/home');
          break;
        case 'tourist':
          navigate('/tourist/home');
          break;
        default:
          navigate('/');
          break;
      }
      // navigate('/admin/products/viewProducts');
    } catch (err) {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div className='login-page-wrapper'>
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          <h1>Triptomania</h1>
          <form onSubmit={handleLogin}>
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className={`${styles['form-group']} ${styles['flex-container']}`}>
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
              <p
                className={styles['forgot-password']}
                onClick={() => navigate('/auth/requestOtp')}
              >
                Forgot Password?
              </p>
            </div>
            {error && <p className={styles['error-message']}>{error}</p>}
            <button type="submit" className={styles['login-button']}>Login</button>
            <p
              className={styles['signup-button']}
              // Uncomment below if you want to enable navigation
              onClick={() => navigate('/signUp')}
            >
              Don't have an account? Sign up
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

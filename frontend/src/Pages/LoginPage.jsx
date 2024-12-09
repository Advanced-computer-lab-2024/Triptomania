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

      const user = response.data.user; // Assuming backend sends a user object
      if (user && type === 'tourist') {
        localStorage.setItem('touristId', user._id); // Save only if the user is a tourist
      }

      alert('Login successful!');
      setUser(response.data.user);
      switch (type) {
        case 'admin':
          navigate('/admin/home');
          break;
        case 'advertiser':
          if (response.data.user.status === 'rejected') {
            alert('Your account has been rejected. Please contact the admin.');
            return;
          } else if (response.data.user.status === 'pending') {
            alert('Your account is pending approval. Please wait for the admin to approve.');
            return;
          } else if (response.data.user.status === 'accepted') {
            if (response.data.user.acceptedTerms) {
              navigate('/advertiser/home');
            } else {
              navigate('/acceptTerms')
            }
          }
          break;
        case 'seller':
          console.log(response.data.user.status, response.data.user.acceptedTerms);
          if (response.data.user.status === 'rejected') {
            alert('Your account has been rejected. Please contact the admin.');
            return;
          } else if (response.data.user.status === 'pending') {
            alert('Your account is pending approval. Please wait for the admin to approve.');
            return;
          } else if (response.data.user.status === 'accepted') {
            if (response.data.user.acceptedTerms) {
              navigate('/seller/home');
            } else {
              navigate('/acceptTerms')
            }
          }
          break;
        case 'tourGuide':
          if (response.data.user.status === 'rejected') {
            alert('Your account has been rejected. Please contact the admin.');
            return;
          } else if (response.data.user.status === 'pending') {
            alert('Your account is pending approval. Please wait for the admin to approve.');
            return;
          } else if (response.data.user.status === 'accepted') {
            if (response.data.user.acceptedTerms) {
              navigate('/tourGuide/home');
            } else {
              navigate('/acceptTerms')
            }
          }
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
          <h1>TripTomania</h1>
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
            <p
              className={styles['signup-button']}
              // Uncomment below if you want to enable navigation
              onClick={() => navigate('/')}
            >
              Or browse as a guest
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

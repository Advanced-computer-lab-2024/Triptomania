import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import axiosInstance from '@/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prevPasswords => ({ ...prevPasswords, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/api/auth/logout');
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      alert('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosInstance.put('/api/auth/changePassword', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      });
      if (response.status === 200) {
        alert('Password changed successfully');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put('/api/tourismGovernor/request/delete');
      if (response.status === 200) {
        alert('Account marked for deletion');
      } else {
        throw new Error('An error occured');
      }
    } catch (error) {
      alert('Failed to initiate request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
        </div>
        <Button type="submit" className="mt-4 bg-primary text-white hover:bg-secondary">
          Change Password
        </Button>
      </form>
      <br></br>
      <div id='security-buttons'>
        <Button className="ml-4 bg-red-600 text-white hover:bg-red-700" onClick={handleRequestDelete}>
          Request Account Deletion
        </Button>
        <Button id='tab-button' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;


import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await fetch('/api/notification-settings');
        const data = await response.json();
        setNotifications(data.enabled);
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prevPasswords => ({ ...prevPasswords, [name]: value }));
  };

  const handleNotificationToggle = async () => {
    try {
      const response = await fetch('/api/update-notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !notifications }),
      });
      if (response.ok) {
        setNotifications(!notifications);
      } else {
        throw new Error('Failed to update notification settings');
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      alert('Failed to update notification settings. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });
      if (response.ok) {
        alert('Password changed successfully');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">Security & Settings</h2>
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
      <div>
        <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={handleNotificationToggle}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
            Receive notifications
          </label>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;


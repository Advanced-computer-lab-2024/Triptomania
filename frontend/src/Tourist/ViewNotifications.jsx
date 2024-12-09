import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewNotifications.css';
import { Header } from '@/components/HeaderTourist';
import Loading from '@/components/Loading';

const ViewNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/api/tourist/getNotifications');
        if (response.data.notifications && response.data.notifications.length === 0) {
          setError('No notifications found.');
        } else {
          setNotifications(response.data.notifications || []);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notifications');
        setLoading(false);
        console.error(err); // Log the error for debugging
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.post('/api/tourist/readNotification', { notificationId });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Header />
      <div className="view-notifications-container">
        <div className="view-notifications-form">
          <h2>Your Notifications</h2>
          {notifications.length === 0 ? (
            <p>No notifications found</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification._id} className={`notification-item ${notification.read ? 'read' : ''}`}>
                  <div className="notification-info">
                    <h3>{notification.title}</h3>
                    <p>{notification.body}</p>
                  </div>
                  {!notification.read && (
                    <button
                      className="mark-as-read-button"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNotifications;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance'; // Adjust this to your actual axios instance
import './EditActivity.css'; // Style for the activity edit form
import Loading from '@/components/Loading';

const EditActivity = () => {
  const { id } = useParams(); // Get activity ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [activity, setActivity] = useState(null); // Activity state
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  // Fetch activity data on component load
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Fixing the API endpoint
        const response = await axiosInstance.get(`/api/advertiser/activities/getActivity/${id}`);
        setActivity(response.data); // Set activity state with response data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activity:', error.message); // Debug error
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || 'Unable to fetch activity details.');
        } else {
          setErrorMessage('Network error. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivity((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox for isBookingOpen
    }));
    setErrorMessage('');
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put('/api/advertiser/activity/editActivity', {
        id,
        ...activity,
      });
      setSuccessMessage(response.data.message || 'Changes saved successfully!');
      setTimeout(() => navigate('/advertiser/Activities'), 2000); // Redirect after success
    } catch (error) {
      console.error('Error saving activity:', error.message); // Debug error
      setErrorMessage('Failed to save changes. Please try again.');
    }
  };

  // Loading and error state
  if (loading) return <Loading />;

  return (
    <div className="edit-activity-container">
      <h1>Edit Activity</h1>
      <div className="form">
        {/* Activity Name */}
        <div className="form-group">
          <label htmlFor="name">Activity Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={activity?.name || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={activity?.description || ''}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={activity?.date || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Time */}
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            id="time"
            name="time"
            type="time"
            value={activity?.time || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={activity?.location || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            value={activity?.price || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            value={activity?.category || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <textarea
            id="tags"
            name="tags"
            value={activity?.tags?.join(', ') || ''}
            onChange={(e) =>
              setActivity((prev) => ({
                ...prev,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Special Discounts */}
        <div className="form-group">
          <label htmlFor="specialDiscounts">Special Discounts</label>
          <input
            id="specialDiscounts"
            name="specialDiscounts"
            type="text"
            value={activity?.specialDiscounts || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Is Booking Open */}
        <div className="form-group">
          <label htmlFor="isBookingOpen">Is Booking Open</label>
          <input
            id="isBookingOpen"
            name="isBookingOpen"
            type="checkbox"
            checked={activity?.isBookingOpen || false}
            onChange={handleInputChange}
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={() => navigate('/advertiser/Activities')}>
            Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && <div className="message success-message">{successMessage}</div>}
      {errorMessage && <div className="message error-message">{errorMessage}</div>}
    </div>
  );
};

export default EditActivity;

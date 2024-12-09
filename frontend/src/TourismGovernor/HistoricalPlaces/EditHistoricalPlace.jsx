import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import { Header } from '@/components/TourguideHeader';
import Loading from '@/components/Loading';

const EditHistoricalPlace = () => {
  const { id } = useParams(); // Get itinerary ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [place, setPlace] = useState(null); // Itinerary state
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  // Fetch itinerary data on component load
  useEffect(() => {
    const fetchHistoricalPlace = async () => {
      try {
        const response = await axiosInstance.get(`/api/tourismGovernor/getHistoricalPlace/${id}`);
        setPlace(response.data.data); // Set itinerary state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical place:', error.message); // Debug error
        setErrorMessage('Unable to fetch historical place details.');
        setLoading(false);
      }
    };

    fetchHistoricalPlace();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace((prev) => ({
      ...prev,
      [name]: name === 'ticket-price' ? parseFloat(value) : value, // Ensure price is numeric
    }));
    setErrorMessage('');
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put('/api/tourismGovernor/editHistoricalPlace', {
        id,
        ...place,
      });
      setSuccessMessage(response.data.message || 'Changes saved successfully!');
      setTimeout(() => navigate('/myHistoricalPlaces'), 2000); // Redirect after success
    } catch (error) {
      console.error('Error saving historical place:', error.message); // Debug error
      setErrorMessage('Failed to save changes. Please try again.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Header />
      <div className="edit-itinerary-container">
        <h1>Edit Historical Place</h1>
        <div className="form">
          {/* Itinerary Name */}
          <div className="form-group">
            <label htmlFor="name">Historical Place Name</label>
            <input
              id="name"
              name="Name"
              type="text"
              value={place?.Name || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Historical Place Description</label>
            <input
              id="description"
              name="Description"
              type="text"
              value={place?.Description || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Historical Place Location</label>
            <input
              id="location"
              name="Location"
              type="text"
              value={place?.Location || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="opening-hours">Historical Place Opening Hours</label>
            <input
              id="opening-hours"
              name="Opening_hours"
              type="text"
              value={place?.Opening_hours || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="closing-hours">Historical Place Closing Hours</label>
            <input
              id="closing-hours"
              name="Closing_hours"
              type="text"
              value={place?.Closing_hours || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="ticket-prices">Ticket Price</label>
            <input
              id="ticket-price"
              name="ticket-price"
              type="number"
              value={place?.Ticket_prices || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* Actions */}
          <div className="form-actions">
            <button className="save-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => navigate('/myHistoricalPlaces')}>
              Cancel
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && <div className="message success-message">{successMessage}</div>}
        {errorMessage && <div className="message error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default EditHistoricalPlace;

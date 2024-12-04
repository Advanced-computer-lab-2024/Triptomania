import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './editMyItinerary.css';

const EditMyItinerary = () => {
  const { id } = useParams(); // Get itinerary ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [itinerary, setItinerary] = useState(null); // Itinerary state
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  // Fetch itinerary data on component load
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axiosInstance.get(`/api/tourGuide/itinerary/getItinerary/${id}`);
        console.log('Fetched Itinerary:', response.data.data); // Debug response
        setItinerary(response.data.data); // Set itinerary state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching itinerary:', error.message); // Debug error
        setErrorMessage('Unable to fetch itinerary details.');
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value, // Ensure price is numeric
    }));
    setErrorMessage('');
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    try {
      console.log('Payload being sent:', itinerary); // Debug payload
      const response = await axiosInstance.put('/api/tourGuide/itinerary/editItinerary', {
        id,
        ...itinerary,
      });
      console.log('API Response:', response.data); // Debug response
      setSuccessMessage(response.data.message || 'Changes saved successfully!');
      setTimeout(() => navigate('/tourGuide/MyItineraries'), 2000); // Redirect after success
    } catch (error) {
      console.error('Error saving itinerary:', error.message); // Debug error
      setErrorMessage('Failed to save changes. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!itinerary) return <div>{errorMessage || 'Itinerary not found.'}</div>;

  return (
    <div className="edit-itinerary-container">
      <h1>Edit Itinerary</h1>
      <div className="form">
        {/* Itinerary Name */}
        <div className="form-group">
          <label htmlFor="name">Itinerary Name</label>
          <input
            id="name"
            name="Name"
            type="text"
            value={itinerary?.Name || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Activities */}
        <div className="form-group">
          <label htmlFor="activities">Activities</label>
          <textarea
            id="activities"
            name="activities"
            value={itinerary?.activities?.join(', ') || ''}
            onChange={(e) =>
              setItinerary((prev) => ({
                ...prev,
                activities: e.target.value.split(',').map((act) => act.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Locations to Visit */}
        <div className="form-group">
          <label htmlFor="locationsToVisit">Locations to Visit</label>
          <textarea
            id="locationsToVisit"
            name="locationsToVisit"
            value={itinerary?.locationsToVisit?.join(', ') || ''}
            onChange={(e) =>
              setItinerary((prev) => ({
                ...prev,
                locationsToVisit: e.target.value.split(',').map((loc) => loc.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Timeline */}
        <div className="form-group">
          <label htmlFor="timeLine">Timeline</label>
          <input
            id="timeLine"
            name="timeLine"
            type="text"
            value={itinerary?.timeLine || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <input
            id="duration"
            name="duration"
            type="text"
            value={itinerary?.duration || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Language */}
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input
            id="language"
            name="language"
            type="text"
            value={itinerary?.language || ''}
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
            value={itinerary?.price || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Available Dates */}
        <div className="form-group">
          <label htmlFor="availableDates">Available Dates</label>
          <textarea
            id="availableDates"
            name="availableDates"
            value={itinerary?.availableDates?.join(', ') || ''}
            onChange={(e) =>
              setItinerary((prev) => ({
                ...prev,
                availableDates: e.target.value.split(',').map((date) => date.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Available Times */}
        <div className="form-group">
          <label htmlFor="availableTimes">Available Times</label>
          <textarea
            id="availableTimes"
            name="availableTimes"
            value={itinerary?.availableTimes?.join(', ') || ''}
            onChange={(e) =>
              setItinerary((prev) => ({
                ...prev,
                availableTimes: e.target.value.split(',').map((time) => time.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Accessibility */}
        <div className="form-group">
          <label htmlFor="accesibility">Accessibility</label>
          <textarea
            id="accesibility"
            name="accesibility"
            value={itinerary?.accesibility?.join(', ') || ''}
            onChange={(e) =>
              setItinerary((prev) => ({
                ...prev,
                accesibility: e.target.value.split(',').map((acc) => acc.trim()),
              }))
            }
          ></textarea>
        </div>

        {/* Pickup Location */}
        <div className="form-group">
          <label htmlFor="pickUp">Pickup Location</label>
          <input
            id="pickUp"
            name="pickUp"
            type="text"
            value={itinerary?.pickUp || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Dropoff Location */}
        <div className="form-group">
          <label htmlFor="dropOff">Dropoff Location</label>
          <input
            id="dropOff"
            name="dropOff"
            type="text"
            value={itinerary?.dropOff || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={() => navigate('/tourGuide/MyItineraries')}>
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

export default EditMyItinerary;

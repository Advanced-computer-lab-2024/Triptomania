import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './PreferencesTags.css'; // Make sure to include your CSS file here

const PreferencesPage = () => {
  const [userId, setUserId] = useState('');  // Make sure userId is correctly set
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    // Assuming you have a way to fetch the userId from cookies or localStorage
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setUserId(userIdFromLocalStorage);
      fetchPreferences(userIdFromLocalStorage);
    }
  }, []);

  const fetchPreferences = async (userId) => {
    try {
      // Fetch current preferences for the user (optional, if needed)
     const response = await axiosInstance.put(
  `/tourist/selectTouristPreferences?touristId=${userId}`,
  { preferences: selectedPreferences }
);

    } catch (error) {
      console.error('Error fetching preferences:', error);
      setErrorMessage('An error occurred while fetching preferences. Please try again later.');
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPreferences((prevPreferences) =>
      checked
        ? [...prevPreferences, value]
        : prevPreferences.filter((preference) => preference !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (selectedPreferences.length === 0) {
      setErrorMessage('Please select at least one preference.');
      return;
    }

    try {
      // Update the API call to use the correct URL structure with touristId in the path
      const response = await axiosInstance.put(`/api/tourist/selectTouristPreferences?touristId=${userId}`, {
        preferences: selectedPreferences,
      });
      const result = response.data;

      if (response.status === 200) {
        alert(result.message);
      } else {
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting preferences:', error);
      setErrorMessage('An error occurred while submitting your preferences. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Choose Your Preferences</h2>
      <form id="preferencesForm" onSubmit={handleSubmit}>
        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              name="preferences"
              value="Historic Areas"
              checked={selectedPreferences.includes('Historic Areas')}
              onChange={handleCheckboxChange}
            />{' '}
            Historic Areas
          </label>
        </div>

        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              name="preferences"
              value="Beaches"
              checked={selectedPreferences.includes('Beaches')}
              onChange={handleCheckboxChange}
            />{' '}
            Beaches
          </label>
        </div>

        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              name="preferences"
              value="Family-Friendly"
              checked={selectedPreferences.includes('Family-Friendly')}
              onChange={handleCheckboxChange}
            />{' '}
            Family-Friendly Activities
          </label>
        </div>

        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              name="preferences"
              value="Shopping"
              checked={selectedPreferences.includes('Shopping')}
              onChange={handleCheckboxChange}
            />{' '}
            Shopping
          </label>
        </div>

        <div className="preference-group">
          <label>
            <input
              type="checkbox"
              name="preferences"
              value="Budget Options"
              checked={selectedPreferences.includes('Budget Options')}
              onChange={handleCheckboxChange}
            />{' '}
            Budget Options
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit Preferences
        </button>
        {errorMessage && <div id="errorMessage" className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default PreferencesPage;

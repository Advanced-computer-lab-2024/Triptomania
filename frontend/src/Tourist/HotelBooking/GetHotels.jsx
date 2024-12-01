import { useState } from 'react';
import axiosInstance from '@/axiosInstance.js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin } from 'lucide-react';
import './GetHotels.css'; // Import custom styles

const GetHotels = () => {
  const [city, setCity] = useState('');
  const [responseData, setResponseData] = useState(null); // To store JSON response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!city) {
      setError('City is required');
      return;
    }
    setLoading(true);
    setError('');
    setResponseData(null); // Clear previous results
    try {
      const response = await axiosInstance.get(`/api/tourist/getHotels?city=${city}`);
      setResponseData(response.data.hotels.result.data); // Store JSON response
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="view-hotels">
      <h1 className="header">Hotel Finder</h1>
      <div className="search-container">
        <div className="search-bar">
          <Input
            placeholder="Enter City Name"
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button className="search-button" onClick={handleSearch}>Search</Button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}
      {responseData && (
        <div className="hotels-container">
          {responseData.map((hotel) => (
            <div key={hotel.hotelId} className="hotel-card">
              <div className="hotel-image-container">
                <img
                  src={
                    isBase64(hotel.Picture)
                      ? `data:image/jpeg;base64,${hotel.Picture}`
                      : hotel.image || 'https://via.placeholder.com/300x200'
                  }
                  alt={hotel.name}
                  className="hotel-image"
                />
              </div>
              <div className="hotel-details">
                <div className="hotel-header">
                  <h2 className="hotel-title">{hotel.name}</h2>
                  <div className="hotel-rating">
                    <Star className="icon" />
                    <span>{hotel.rating || 'N/A'}</span>
                  </div>
                </div>
                <p className="hotel-description">Location: {hotel.geoCode.latitude}, {hotel.geoCode.longitude}</p>
                <div className="hotel-info">
                  <p>
                    <MapPin className="icon" />
                    {hotel.address.countryCode || 'N/A'}
                  </p>
                </div>
                <div className="hotel-footer">
                  <Button className="more-info-button">More Info</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetHotels;

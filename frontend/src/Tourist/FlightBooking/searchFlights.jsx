import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance.js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin } from 'lucide-react';
import './searchFlights.css';

const SearchFlights = () => {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { origin, destination, departure_date, return_date } = searchParams;
    try {
      const response = await axiosInstance.post('/api/tourist/searchFlights', {
        origin,
        destination,
        departure_date,
        ...(return_date && { return_date }),
      });
      setFlights(response.data || []);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Error fetching flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-flights">
      <h1 className="header">Flight Finder</h1>
      <div className="search-container">
        <div className="search-bar">
          <Input
            placeholder="Origin"
            className="search-input"
            value={searchParams.origin}
            onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
          />
          <Input
            placeholder="Destination"
            className="search-input"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
          />
          <Input
            type="date"
            className="search-input"
            value={searchParams.departure_date}
            onChange={(e) => setSearchParams({ ...searchParams, departure_date: e.target.value })}
          />
          <Input
            type="date"
            className="search-input"
            value={searchParams.return_date}
            onChange={(e) => setSearchParams({ ...searchParams, return_date: e.target.value })}
          />
          <Button className="search-button" onClick={handleSubmit}>Search Flights</Button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      {flights.length > 0 && (
        <div className="flights-container">
          {flights.map((flight) => (
            <div key={flight.id} className="flight-card">
              <div className="flight-header">
                <h2 className="flight-title">Flight Offer {flight.id}</h2>
              </div>
              <div className="flight-details">
                {flight.itineraries?.map((itinerary, index) => (
                  <div key={index} className="itinerary">
                    <h4>Itinerary {index + 1}</h4>
                    {itinerary.segments?.map((segment, segmentIndex) => (
                      <div key={segmentIndex} className="flight-segment">
                        <div className="flight-info">
                          <p><strong>Departure:</strong> {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
                          <p><strong>Arrival:</strong> {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
                          <p><strong>Flight Number:</strong> {segment.flightNumber || 'N/A'}</p>
                          <p><strong>Aircraft:</strong> {segment.aircraft.code || 'N/A'}</p>
                          <p><strong>Duration:</strong> {itinerary.duration || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flight-footer">
                <p className="flight-price">
                  <strong>Total Price:</strong> {flight.price?.currency} {flight.price?.total}
                </p>
                <Button className="more-info-button" onClick={() => window.location.href = `/tourist/getFlightOffers?flightId=${flight.id}`}>More Info</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFlights;

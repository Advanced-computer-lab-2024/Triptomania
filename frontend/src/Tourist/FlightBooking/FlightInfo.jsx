import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './FlightInfo.css';

const FlightInfo = () => {
  const { flightId } = useParams(); // Use useParams to get the flight ID from the URL
  const [flightDetails, setFlightDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightId) {
        setError('No flight offer ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/tourist/getFlightDetails`, {
          params: { flightOfferId: flightId }, // Send flightOfferId as a query parameter
        });
        setFlightDetails(response.data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setError('Failed to fetch flight details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  const handleBooking = () => {
    navigate(`/bookFlight?flight_id=${flightId}`); // Redirect to the booking page with flight ID
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="flight-info">
      <h1>Flight Details</h1>
      {flightDetails && (
        <div className="flight-details-container">
          <div className="flight-price">
            <p>
              <strong>Price:</strong> {flightDetails.price.total} {flightDetails.price.currency}
            </p>
          </div>
          <div className="flight-itinerary">
            <h3>Itinerary</h3>
            {flightDetails.itineraries?.map((itinerary, index) => (
              <div key={index} className="itinerary">
                <h4>Segment {index + 1}</h4>
                {itinerary.segments?.map((segment, segmentIndex) => (
                  <div key={segmentIndex} className="segment">
                    <p>
                      <strong>From:</strong> {segment.departure.iataCode} at{' '}
                      {new Date(segment.departure.at).toLocaleString()}
                    </p>
                    <p>
                      <strong>To:</strong> {segment.arrival.iataCode} at{' '}
                      {new Date(segment.arrival.at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Flight Number:</strong> {segment.flightNumber || 'N/A'}
                    </p>
                    <p>
                      <strong>Aircraft:</strong> {segment.aircraft?.code || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="book-flight-button" onClick={handleBooking}>
            Book This Flight
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightInfo;

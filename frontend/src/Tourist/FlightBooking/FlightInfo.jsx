import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './FlightInfo.css';
import Loading from '@/components/Loading';
import { Header } from '@/components/HeaderTourist';

const FlightInfo = () => {
  const { flightOfferId } = useParams();
  const [flightDetails, setFlightDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!flightOfferId) {
        setError('No flight offer ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/tourist/getFlightDetails?flightOfferId=${flightOfferId}`);
        setFlightDetails(response.data.flightOffers[0]);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setError('Failed to fetch flight details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightOfferId]);

  const handleBooking = () => {
    navigate(`/bookFlight?flight_id=${flightOfferId}`);
  };

  const handleBackToOffers = () => {
    navigate('/allOffers');  // Change '/allOffers' to the correct path for flight offers
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="flight-info">
      <Header />
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
          <div className="buttons-container">
            <button className="book-flight-button" onClick={handleBooking}>
              Book This Flight
            </button>
            <button className="back-to-offers-button" onClick={handleBackToOffers}>
              Back to All Offers
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightInfo;

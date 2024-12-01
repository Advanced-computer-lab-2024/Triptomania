import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '@/components/ui/button';
import axiosInstance from '@/axiosInstance.js';
import './GetHotelOffers.css';

const GetHotelOffers = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const hotelId = new URLSearchParams(location.search).get('hotelId');

  useEffect(() => {
    const fetchHotelOffers = async () => {
      if (!hotelId) {
        setError('Hotel ID is missing');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/api/tourist/getHotelOffers`, {
          params: { hotelId },
        });

        console.log('API Response:', response.data);
        setApiResponse(response.data);
        setOffers(response.data.offers || []);
      } catch (err) {
        console.error('Error fetching hotel offers:', err);
        if (err.response) {
          console.log('Error Response JSON:', err.response.data);
        }
        if (
          err.response?.status === 400 &&
          err.response?.data?.error === 'No rooms available at the requested property'
        ) {
          setError('No rooms available at the requested property');
          setOffers([]);
        } else {
          setError(err.response?.data?.error || 'Failed to fetch hotel offers');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHotelOffers();
  }, [hotelId]);

  return (
    <div className="hotel-offers-container">
      <h1 className="page-title">Exclusive Hotel Offers</h1>

      {/* Back Button */}
      <Button className="back-button" onClick={() => navigate(-1)}>
        Back
      </Button>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}
      {!loading && !error && offers.length === 0 && <p className="no-offers-message">No offers available.</p>}

      <div className="offers-grid">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="hotel-image-container">
              <img
                src={offer.hotel.image || 'https://via.placeholder.com/300x200'}
                alt={offer.hotel.name}
                className="hotel-image"
              />
            </div>
            <div className="offer-details">
              <h3>Hotel: {offer.hotel?.name || 'Hotel Name Not Available'}</h3>
              <p>Location: Latitude {offer.hotel?.latitude}, Longitude {offer.hotel?.longitude}</p>
              <p>City: {offer.hotel?.cityCode || 'N/A'}</p>

              {/* Nested Offers */}
              {offer.offers?.map((roomOffer, idx) => (
                <div key={idx} className="room-offer">
                  <h4>Room Type: {roomOffer.room?.type || 'Room Type Not Available'}</h4>
                  <p>Description: {roomOffer.room?.description?.text || 'No description provided'}</p>
                  <p>Category: {roomOffer.room?.typeEstimated?.category || 'N/A'}</p>
                  <p>
                    Beds: {roomOffer.room?.typeEstimated?.beds || 'Unknown'} {roomOffer.room?.typeEstimated?.bedType || ''}
                  </p>
                  <p>Guests: {roomOffer.guests?.adults || 'N/A'} Adults</p>
                  <p>
                    Price: {roomOffer.price?.total || 'N/A'} {roomOffer.price?.currency || ''}
                  </p>
                  <p>
                    Check-in: {roomOffer.checkInDate || 'N/A'}, Check-out: {roomOffer.checkOutDate || 'N/A'}
                  </p>
                  <p>
                    Cancellation Policy:{' '}
                    {roomOffer.policies?.cancellations?.[0]?.amount
                      ? `Cancel by ${roomOffer.policies.cancellations[0].deadline} for a fee of ${roomOffer.policies.cancellations[0].amount}`
                      : 'No free cancellation'}
                  </p>
                  <Button className="book-button">Book Now</Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetHotelOffers;
  
import React, { useState } from 'react';
import axiosInstance from '@/axiosInstance';
import './TransportationBooking.css';

const TransportationBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  const dummyBookings = [
    {
      origin: 'New York',
      destination: 'Washington D.C.',
      travelDate: '2023-12-10',
      travelTime: '10:00',
      travelType: 'Bus',
    },
    {
      origin: 'Los Angeles',
      destination: 'San Francisco',
      travelDate: '2023-12-12',
      travelTime: '15:00',
      travelType: 'Train',
    },
    {
      origin: 'Chicago',
      destination: 'New York',
      travelDate: '2023-12-15',
      travelTime: '09:00',
      travelType: 'Car',
    },
  ];

  const displayDummyBookings = () => {
    setBookings(dummyBookings);
    setResponseMessage('');
  };

  const confirmBooking = async (index) => {
    const booking = dummyBookings[index];
    const requestBody = {
      origin: booking.origin,
      destination: booking.destination,
      travelDate: booking.travelDate,
      travelTime: booking.travelTime,
      travelType: booking.travelType,
    };

    try {
      const response = await axiosInstance.post('/api/tourist/bookTransportation', requestBody);
      setResponseMessage(`Booking confirmed: ${response.data.message}`);
    } catch (error) {
      console.error(error);
      setResponseMessage(error.response?.data?.error || 'An error occurred while booking transportation.');
    }
  };

  return (
    <div className="container">
      <h1>Book Transportation</h1>
      <button onClick={displayDummyBookings}>View Available Bookings</button>

      <div className="bookings-container">
        {bookings.map((booking, index) => (
          <div className="booking-card" key={index}>
            <p>
              <strong>Origin:</strong> {booking.origin}
            </p>
            <p>
              <strong>Destination:</strong> {booking.destination}
            </p>
            <p>
              <strong>Travel Date:</strong> {booking.travelDate}
            </p>
            <p>
              <strong>Travel Time:</strong> {booking.travelTime}
            </p>
            <p>
              <strong>Travel Type:</strong> {booking.travelType}
            </p>
            <button onClick={() => confirmBooking(index)}>Confirm Booking</button>
          </div>
        ))}
      </div>

      <p className="response-message">{responseMessage}</p>
    </div>
  );
};

export default TransportationBooking;

import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import axiosInstance from '@/axiosInstance';

const Bookings = ({ type }) => {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/tourist/getBookings?type=${type}`);
        setBookings(response.data);
      } catch (error) {
        console.error(`Error fetching ${type} bookings:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [type]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upcoming Bookings</h3>
        {bookings.upcoming.length === 0 ? 
          <p>No upcoming bookings</p> : 
          type === 'hotel' ? (
            bookings.upcoming.map((booking) => (
              <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-2">
                <p className="font-semibold">{booking.hotel.name}</p>
                <p>Check-in Date: {booking.hotelOffer.checkInDate}</p>
                <p>Check-out Date: {booking.hotelOffer.checkOutDate}</p>
                <p>Booking Status: {booking.bookingStatus}</p>
                <p>Total Price: {booking.hotelOffer.price.total} {booking.hotelOffer.price.currency}</p>
                <p>Room Description: {booking.hotelOffer.room.description.text}</p>
              </div>
            ))
          ) : type === 'flight' ? (
            <p>Flight bookings</p>
          ) : bookings.upcoming.map((booking, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{booking.travelType}</p>
              <p>Origin: {booking.origin}</p>
              <p>Destination: {booking.destination}</p>
              <p>Travel Date: {booking.travelDate}</p>
              <p>Travel Time: {booking.travelTime}</p>
            </div>
          ))
        }
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Past Bookings</h3>
        {bookings.past.length === 0 ? 
          <p>No past bookings</p> : 
          type === 'hotel' ? (
            bookings.past.map((booking) => (
              <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-2">
                <p className="font-semibold">{booking.hotel.name}</p>
                <p>Check-in Date: {booking.hotelOffer.checkInDate}</p>
                <p>Check-out Date: {booking.hotelOffer.checkOutDate}</p>
                <p>Booking Status: {booking.bookingStatus}</p>
                <p>Total Price: {booking.hotelOffer.price.total} {booking.hotelOffer.price.currency}</p>
                <p>Room Description: {booking.hotelOffer.room.description.text}</p>
              </div>
            ))
          ) : type === 'flight' ? (
            <p>Flight bookings</p>
          ) : bookings.past.map((booking, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{booking.travelType}</p>
              <p>Origin: {booking.origin}</p>
              <p>Destination: {booking.destination}</p>
              <p>Travel Date: {booking.travelDate}</p>
              <p>Travel Time: {booking.travelTime}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Bookings;

import React, { useState, useEffect } from 'react';

const Bookings = ({ type }) => {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/${type}-bookings`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error(`Error fetching ${type} bookings:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [type]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">{type.charAt(0).toUpperCase() + type.slice(1)} Bookings</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upcoming Bookings</h3>
        {bookings.upcoming.map(booking => (
          <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-2">
            <p className="font-semibold">{booking.name}</p>
            <p>Date: {booking.date}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Past Bookings</h3>
        {bookings.past.map(booking => (
          <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-2">
            <p className="font-semibold">{booking.name}</p>
            <p>Date: {booking.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;


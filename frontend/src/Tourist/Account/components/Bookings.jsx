import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import axiosInstance from '@/axiosInstance';

const Bookings = ({ type }) => {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setBookings({ upcoming: [], past: [] }); // Clear the previous data
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

    return () => {
      setBookings({ upcoming: [], past: [] });
    };
  }, [type]); // Re-fetch when `type` changes

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Upcoming Bookings</h3>
        {bookings.upcoming.length === 0 ? (
          <p>No upcoming bookings</p>
        ) : type === 'hotel' ? (
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
          bookings.upcoming.map((booking) => (
            <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="font-semibold">Flight Booking</p>
              <p>Last Ticketing Date: {booking.lastTicketingDate}</p>
              <p>Total Price: {booking.price.grandTotal} {booking.price.currency}</p>
              {booking.itineraries.map((itinerary, i) => (
                <div key={i} className="border p-4 rounded-md mb-2">
                  <p className="font-semibold">Itinerary {i + 1}</p>
                  {itinerary.segments.map((segment, j) => (
                    <div key={segment.id} className="border-b pb-2 mb-2">
                      <p><strong>Segment {j + 1}</strong></p>
                      <p>Departure: {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
                      <p>Arrival: {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
                      <p>Carrier Code: {segment.carrierCode} Flight Number: {segment.number}</p>
                      <p>Aircraft: {segment.aircraft.code}</p>
                      <p>Duration: {segment.duration}</p>
                      <p>Number of Stops: {segment.numberOfStops}</p>
                      <p>CO2 Emissions: {segment.co2Emissions[0].weight} {segment.co2Emissions[0].weightUnit} (Cabin: {segment.co2Emissions[0].cabin})</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          bookings.upcoming.map((booking, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{booking.travelType}</p>
              <p>Origin: {booking.origin}</p>
              <p>Destination: {booking.destination}</p>
              <p>Travel Date: {booking.travelDate}</p>
              <p>Travel Time: {booking.travelTime}</p>
            </div>
          ))
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Past Bookings</h3>
        {bookings.past.length === 0 ? (
          <p>No past bookings</p>
        ) : type === 'hotel' ? (
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
          bookings.past.map((booking) => (
            <div key={booking.id} className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="font-semibold">Flight Booking</p>
              <p>Last Ticketing Date: {booking.lastTicketingDate}</p>
              <p>Total Price: {booking.price.grandTotal} {booking.price.currency}</p>
              {booking.itineraries.map((itinerary, i) => (
                <div key={i} className="border p-4 rounded-md mb-2">
                  <p className="font-semibold">Itinerary {i + 1}</p>
                  {itinerary.segments.map((segment, j) => (
                    <div key={segment.id} className="border-b pb-2 mb-2">
                      <p><strong>Segment {j + 1}</strong></p>
                      <p>Departure: {segment.departure.iataCode} at {new Date(segment.departure.at).toLocaleString()}</p>
                      <p>Arrival: {segment.arrival.iataCode} at {new Date(segment.arrival.at).toLocaleString()}</p>
                      <p>Carrier Code: {segment.carrierCode} Flight Number: {segment.number}</p>
                      <p>Aircraft: {segment.aircraft.code}</p>
                      <p>Duration: {segment.duration}</p>
                      <p>Number of Stops: {segment.numberOfStops}</p>
                      <p>CO2 Emissions: {segment.co2Emissions[0].weight} {segment.co2Emissions[0].weightUnit} (Cabin: {segment.co2Emissions[0].cabin})</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          bookings.past.map((booking, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{booking.travelType}</p>
              <p>Origin: {booking.origin}</p>
              <p>Destination: {booking.destination}</p>
              <p>Travel Date: {booking.travelDate}</p>
              <p>Travel Time: {booking.travelTime}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;

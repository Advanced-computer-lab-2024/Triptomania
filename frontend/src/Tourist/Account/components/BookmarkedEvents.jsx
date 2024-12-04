import React, { useState, useEffect } from 'react';

const BookmarkedEvents = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        const response = await fetch('/api/bookmarked-events');
        const data = await response.json();
        setBookmarkedEvents(data);
      } catch (error) {
        console.error('Error fetching bookmarked events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-4">Bookmarked Events</h2>
      {bookmarkedEvents.map(event => (
        <div key={event.id} className="bg-gray-100 p-4 rounded-md mb-2">
          <p className="font-semibold">{event.name}</p>
          <p>Date: {event.date}</p>
        </div>
      ))}
    </div>
  );
};

export default BookmarkedEvents;


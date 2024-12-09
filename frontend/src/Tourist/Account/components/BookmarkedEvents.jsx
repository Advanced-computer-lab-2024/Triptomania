import React, { useState, useEffect } from 'react';
import { useUser } from '@/UserContext';
import axiosInstance from '@/axiosInstance';
import Loading from '@/components/Loading';

const BookmarkedEvents = () => {
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        // Fetch the list of bookmarked activities and itineraries (Mongo IDs)
        const response = await axiosInstance.get('/api/tourist/events/getBookmarkedEvents');
        const { activities, itineraries } = response.data.bookmarkedEvents;

        // Fetch activity details
        const fetchedActivities = await Promise.all(
          activities.map(id => axiosInstance.get(`/api/tourist/activities/getActivity/${id}`).then(res => res.data))
        );

        // Fetch itinerary details
        const fetchedItineraries = await Promise.all(
          itineraries.map(id => axiosInstance.get(`/api/tourist/itineraries/getItinerary/${id}`).then(res => res.data))
        );

        // Set the state with the fetched data
        setBookmarkedActivities(fetchedActivities);
        setBookmarkedItineraries(fetchedItineraries);
      } catch (error) {
        console.error('Error fetching bookmarked events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Function to format date
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long', // "Monday"
      year: 'numeric', // "2024"
      month: 'long',   // "December"
      day: 'numeric'   // "20"
    });
  };

  return (
    <div>

      {/* Display Activities */}
      {bookmarkedActivities.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-primary mb-2">Activities</h3>
          {bookmarkedActivities.map(activity => (
            <div key={activity._id} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{activity.name}</p>
              <p>Date: {formatDate(activity.date)}</p>
              {/* Add other activity details as necessary */}
            </div>
          ))}
        </div>
      )}

      {/* Display Itineraries */}
      {bookmarkedItineraries.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-primary mb-2">Itineraries</h3>
          {bookmarkedItineraries.map(itinerary => (
            <div key={itinerary._id} className="bg-gray-100 p-4 rounded-md mb-2">
              <p className="font-semibold">{itinerary.data.Name}</p>
              <p>Start Date: {formatDate(itinerary.data.Start_date)}</p>
              {/* Add other itinerary details as necessary */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedEvents;

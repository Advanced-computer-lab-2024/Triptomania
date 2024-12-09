import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import axiosInstance from "@/axiosInstance";

const Events = () => {
  const [events, setEvents] = useState({
    itineraries: { upcoming: [], past: [] },
    activities: { upcoming: [], past: [] },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/tourist/getBookings?type=event");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const renderEvent = (event) => (
    <div key={event.eventId} className="bg-gray-100 p-4 rounded-md mb-2">
      <p className="font-semibold">{event.name}</p>
      <p>Event Type: {event.eventType}</p>
      <p>Event Date: {event.date}</p>
      <p>Original Price: {event.originalPrice || "N/A"}</p>
      {event.discountAmount && <p>Discount: {event.discountAmount}</p>}
      {event.finalPrice && <p>Final Price: {event.finalPrice}</p>}
      {event.promoCode && <p>Promo Code: {event.promoCode}</p>}
      <p>Status: {event.status}</p>
      {event.status === "Pending" ? (
        // TODO: Implement payment completion
        <button id="tab-button" className="bg-primary text-white px-4 py-2 rounded-md mt-2" onClick="">
          Complete Payment
        </button>
      ) : (
        <p className="text-green-500 mt-2">Event Paid</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Itineraries</h3>
        <h4 className="text-xl font-semibold mb-2">Upcoming Itineraries</h4>
        {events.itineraries.upcoming.length === 0 ? (
          <p>No upcoming itineraries</p>
        ) : (
          events.itineraries.upcoming.map(renderEvent)
        )}
        <h4 className="text-xl font-semibold mt-6 mb-2">Past Itineraries</h4>
        {events.itineraries.past.length === 0 ? (
          <p>No past itineraries</p>
        ) : (
          events.itineraries.past.map(renderEvent)
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Activities</h3>
        <h4 className="text-xl font-semibold mb-2">Upcoming Activities</h4>
        {events.activities.upcoming.length === 0 ? (
          <p>No upcoming activities</p>
        ) : (
          events.activities.upcoming.map(renderEvent)
        )}
        <h4 className="text-xl font-semibold mt-6 mb-2">Past Activities</h4>
        {events.activities.past.length === 0 ? (
          <p>No past activities</p>
        ) : (
          events.activities.past.map(renderEvent)
        )}
      </div>
    </div>
  );
};

export default Events;

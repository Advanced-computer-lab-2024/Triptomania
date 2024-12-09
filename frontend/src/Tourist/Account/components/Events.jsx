import React, { useState, useEffect } from "react";
import Loading from "@/components/Loading";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from "react-router-dom"; // Add this import
const Events = () => {
  const navigate = useNavigate(); // Add this
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

  // Add this function to handle navigation to checkout
  const handleCompletePayment = async (event) => {
    try {
        console.log("Event object:", event); // Log the event object to see what ID we have
        
        // Fetch the itinerary details to get the price
        const response = await axiosInstance.get(`/api/tourist/itineraries/getItineraries`);
        console.log("API Response:", response.data); // Log the full response
        
        // Find the specific itinerary from the response
        const itinerary = response.data.itineraries.find(
            (item) => {
                console.log("Comparing:", {
                    itemId: item._id,
                    eventId: event.eventId,
                    match: item._id === event.eventId
                });
                return item._id === event.eventId;
            }
        );
        
        console.log("Found itinerary:", itinerary);

        if (!itinerary) {
            console.error("Itinerary not found");
            return;
        }

        navigate('/tourist/eventCheckout', { 
            state: { 
                eventId: event.eventId, // Using eventId instead of itineraryId
                eventType: event.eventType.toLowerCase(),
                price: itinerary.price,
                promoCode: event.promoCode,
                eventName: event.name || itinerary.Name,
                eventDate: event.date,
                status: event.status
            }
        });
    } catch (error) {
        console.error("Error fetching itinerary details:", error);
    }
};
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
        <button 
          id="tab-button" 
          className="bg-primary text-white px-4 py-2 rounded-md mt-2 hover:bg-primary/80 transition-colors"
          onClick={() => handleCompletePayment(event)}
        >
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
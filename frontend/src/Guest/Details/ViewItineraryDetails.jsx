import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Search } from 'lucide-react';
import { Header } from "../../components/Header"; // Adjust path if needed
import './ViewItineraryDetails.css'; // Correct CSS import

import { useParams } from "react-router-dom";

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/guest/itineraries/getItinerary/${id}`)
      .then((response) => {
        setItinerary(response.data.data);
        setError(null);  // Clear any previous errors
      })
      .catch((error) => {
        setError("Failed to load itinerary details.");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!itinerary) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <img
          src="/placeholder.svg?height=500&width=1920"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />

       {/* <div className="content">
          <h1 className="text-4xl font-bold mb-4">{itinerary.Name}</h1>
          <p className="text-xl mb-8">{itinerary.timeLine}</p>
        </div>*/}
      </section>

      {/* Itinerary Details */}
      <div className="itinerary-detail-container">
        <h1>{itinerary.Name}</h1>
        
        {/* Details List */}
        <div className="details-list">
          <p><strong>Timeline:</strong> {itinerary.timeLine}</p>
          <p><strong>Duration:</strong> {itinerary.duration}</p>
          <p><strong>Price:</strong> ${itinerary.price}</p>
          <p><strong>Start Date:</strong> {new Date(itinerary.Start_date).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(itinerary.End_date).toLocaleDateString()}</p>
          <p><strong>Pick-Up Location:</strong> {itinerary.pickUpLocation}</p>
          <p><strong>Drop-Off Location:</strong> {itinerary.dropOffLocation}</p>
        </div>

        {/* Activities */}
        <div className="activities">
          <h4>Activities</h4>
          <p>{itinerary.activities.join(', ')}</p>
        </div>

        {/* Available Dates */}
        <div className="date-info">
          <p><strong>Available Dates:</strong> {itinerary.availableDates.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetailPage;

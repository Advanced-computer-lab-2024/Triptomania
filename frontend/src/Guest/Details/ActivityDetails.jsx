import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Search } from 'lucide-react';
import { Header } from "../../components/Header"; // Adjust path if needed
import './ActivityDetails.css'; // Correct CSS import
import { useParams } from "react-router-dom";


const ActivityDetailPage = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/guest/activities/getActivity/${id}`)
      .then((response) => {
        setActivity(response.data);
        setError(null);  // Clear any previous errors
      })
      .catch((error) => {
        setError("Failed to load activity details.");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
 
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
    
        </div>
      </section>

      {/* Activity Details */}
      <div className="activity-detail-container py-12 px-4 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/placeholder.svg?height=300&width=400"  // Placeholder or actual activity image
                alt={activity.name}
                className="w-full h-[200px] object-cover rounded-md"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{new Date(activity.date).toLocaleDateString()}</span>
              </div>
            </CardFooter>
          </Card>

          {/* Details List */}
          <div className="details-list">
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <p><strong>Price:</strong> ${activity.price}</p>
            <p><strong>Time:</strong> {activity.time}</p>
            <p><strong>Special Discounts:</strong> {activity.specialDiscounts.join(", ")}</p>
            <p><strong>Is Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}</p>

            {/* Available Dates (If any) */}
            <div className="date-info mt-4">
              <p><strong>Available Dates:</strong> {activity.specialDiscounts.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Booking Button */}
        <div className="flex justify-center mt-6">
          <Button>Book Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;

import React, { useEffect, useState } from "react";
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Search } from 'lucide-react';
import { Header } from '../components/AdvertiserHeader';
import '../index.css';
import image1 from '../assets/Images/1.png';
import image2 from '../assets/Images/2.png';
import image3 from '../assets/Images/3.jpg';

function FeaturedActivities() {
  const [MyActivities, setMyActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/advertiser/activity/viewMyActivities"
        );
        if (Array.isArray(response.data.activities)) { // Access the 'activities' array
          setMyActivities(response.data.activities);
        } else {
          console.error("Invalid data format: activities is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  function getImageForActivity(index) {
    switch (index) {
      case 0:
        return image1;
      case 1:
        return image2;
      case 2:
        return image3;
      default:
        return image1;
    }
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">My Activities</h2>
      {MyActivities.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No activities available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MyActivities.map((activity, index) => (
            <Card key={activity._id}>
              <CardHeader>
                <CardTitle>{activity.name}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={getImageForActivity(index)}
                  alt="Activity Image"
                  className="w-full h-[200px] object-cover rounded-md"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{activity.price}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <img
          src="src\assets\Images\back.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Book hotels, flights, activities, and more</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input placeholder="Where do you want to go?" className="flex-grow" />
            <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Activities Section */}
      <FeaturedActivities />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Search } from 'lucide-react';
import { Header } from '../components/Header';  // Adjust the path based on your folder structure
import '../index.css';
import image1 from '../assets/Images/1.png';
import image2 from '../assets/Images/2.png';
import image3 from '../assets/Images/3.jpg';
import image4 from '../assets/Images/4.jpg';
import image5 from '../assets/Images/5.jpg';
import image6 from '../assets/Images/6.jpg';
import image7 from '../assets/Images/7.jpg';
import image8 from '../assets/Images/8.jpg';
import image9 from '../assets/Images/9.jpg';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function FeaturedItineraries() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:5000/api/guest/itineraries/viewItineraries");
      
        if (response.data.status && Array.isArray(response.data.itineraries)) {
          setItineraries(response.data.itineraries);
        } else {
          console.error("Invalid data format: itineraries is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  function getImageForItinerary(index) {
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

  const featuredItineraries = itineraries.slice(0, 3);

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Itineraries</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItineraries.map((itinerary, index) => (
          <Card key={itinerary._id}>
            <CardHeader>
              <CardTitle>{itinerary.Name}</CardTitle>
              <CardDescription>Explore the beauty of {itinerary.locationsToVisit[0]}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={getImageForItinerary(index)} alt="Itinerary Image" className="w-full h-[200px] object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{itinerary.duration} days</span>
              </div>
              <Link to={`/itinerary/${itinerary._id}`}>
                <Button>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FeaturedActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:5000/api/guest/activities/viewActivities");
    
        // Directly set the activities as an array from the response
        if (Array.isArray(response.data)) {
          setActivities(response.data); // No need to access 'activities' if it's already an array
        } else {
          console.error("Invalid data format: activities is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    

    fetchActivities();
  }, []);

  const featuredActivities = activities.slice(0, 3);

  return (
    <section className="py-12 px-4 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Popular Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredActivities.map((activity, index) => (
          <Card key={activity._id}>
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={getImageForActivity(index)} alt="Activity Image" className="w-full h-[200px] object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{activity.location}</span>
              </div>
              
              <Link to={`/activity/${activity._id}`}>
                <Button>View Details</Button>
              </Link>
              
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function getImageForActivity(index) {
  switch (index) {
    case 0:
      return image4; // Use the same images for activities or update with actual activity images
    case 1:
      return image5;
    case 2:
      return image6;
    default:
      return image1;
  }
}


function FeaturedHistoricalPlaces() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:5000/api/guest/historicalPlaces/getHistoricalPlaces");
    
        // Directly set the activities as an array from the response
        if (Array.isArray(response.data.historicalPlaces)) {
          setHistoricalPlaces(response.data.historicalPlaces); 
        } else {
          console.error("Invalid data format: places is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    

    fetchHistoricalPlaces();
  }, []);

  const featuredHistoricalPlaces = historicalPlaces.slice(0, 3);

  return (
    <section className="py-12 px-4 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Historical Places</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredHistoricalPlaces.map((historicalPlaces, index) => (
          <Card key={historicalPlaces._id}>
            <CardHeader>
              <CardTitle>{historicalPlaces.Name}</CardTitle>
              <CardDescription>{historicalPlaces.Description}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={getImageForHistoriocalPlaces(index)} alt="Activity Image" className="w-full h-[200px] object-cover rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{historicalPlaces.Location}</span>
              </div>
              
              <Link to={`/historicalPlaces/${historicalPlaces._id}`}>
                <Button>View Details</Button>
              </Link>
              
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function getImageForHistoriocalPlaces(index) {
  switch (index) {
    case 0:
      return image7; // Use the same images for activities or update with actual activity images
    case 1:
      return image8;
    case 2:
      return image9;
    default:
      return image1;
  }
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Book hotels, flights, activities, and more</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input placeholder="Where do you want to go?" className="flex-grow" />
            <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Itineraries Section */}
      <FeaturedItineraries />

      {/* Featured Activities Section */}
      <FeaturedActivities />

      {/* Historical Places Section */}
        <FeaturedHistoricalPlaces />
    </div>
  );
}

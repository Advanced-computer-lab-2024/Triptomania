import React, { useEffect, useState } from "react";
import axiosInstance from '@/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Search } from 'lucide-react';
import { Header } from '../components/GovernerHeader';
import '../index.css';
import image1 from '../assets/Images/1.png';
import image2 from '../assets/Images/2.png';
import image3 from '../assets/Images/3.jpg';
import { Link } from 'react-router-dom';

function FeaturedHistoricalPlaces() {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5000/api/tourismGovernor/getHistoricalPlaces"
        );

        if (Array.isArray(response.data.historicalPlaces)) {
          setHistoricalPlaces(response.data.historicalPlaces); // Update state with the array of historical places
        } else {
          console.error("Invalid data format: historical places is not an array", response.data);
        }
      } catch (error) {
        console.error("Error fetching historical places:", error);
      }
    };

    fetchHistoricalPlaces();
  }, []);

  function getImageForPlace(index) {
    // Assign images based on index; this is just a placeholder logic
    switch (index % 3) { // Cycling through images
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

    const featureplaces = historicalPlaces.slice(0,3); 

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Popular Historical Places</h2>
      {historicalPlaces.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No historical places available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureplaces.map((place, index) => (
            <Card key={place._id}>
              <CardHeader>
                <CardTitle>{place.Name}</CardTitle>
                <CardDescription>{place.Description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={getImageForPlace(index)}
                  alt="Historical Place"
                  className="w-full h-[200px] object-cover rounded-md"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{place.Location}</span>
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
          src="/placeholder.svg?height=500&width=1920" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Discover Your Next Adventure</h1>
          <p className="text-xl mb-8">Explore historical places, attractions, and more</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input placeholder="Where do you want to go?" className="flex-grow" />
            <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Historical Places Section */}
      <FeaturedHistoricalPlaces />
    </div>
  );
}
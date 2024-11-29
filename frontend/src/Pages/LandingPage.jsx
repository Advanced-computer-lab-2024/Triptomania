import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Search } from 'lucide-react'
import { Header } from '../components/Header';  // Adjust the path based on your folder structure
import '../index.css'


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
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
          <p className="text-xl mb-8">Book hotels, flights, activities, and more</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input placeholder="Where do you want to go?" className="flex-grow" />
            <Button><Search className="mr-2 h-4 w-4" /> Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Itineraries Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Itineraries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>7 Days in Paradise</CardTitle>
                <CardDescription>Explore the beauty of Bali</CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/placeholder.svg?height=200&width=400" alt="Itinerary Image" className="w-full h-[200px] object-cover rounded-md" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>7 days</span>
                </div>
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Activities Section */}
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center">Popular Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {['Scuba Diving', 'Mountain Hiking', 'City Tours', 'Food Tasting'].map((activity, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{activity}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src="/placeholder.svg?height=150&width=300" alt={activity} className="w-full h-[150px] object-cover rounded-md" />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Historical Places Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Historical Places</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Colosseum, Rome', 'Machu Picchu, Peru', 'Taj Mahal, India'].map((place, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{place}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src="/placeholder.svg?height=200&width=400" alt={place} className="w-full h-[200px] object-cover rounded-md" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{place.split(',')[1]}</span>
                </div>
                <Button variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

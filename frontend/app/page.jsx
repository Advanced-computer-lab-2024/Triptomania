import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Search } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <Image src="/placeholder.svg" alt="Logo" width={40} height={40} />
          <Link href="/activities" className="text-sm font-medium hover:underline">Activities</Link>
          <Link href="/itineraries" className="text-sm font-medium hover:underline">Itineraries</Link>
          <Link href="/historical-places" className="text-sm font-medium hover:underline">Historical Places</Link>
        </div>
        <Button variant="outline">Login</Button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <Image 
          src="/placeholder.svg?height=500&width=1920" 
          alt="Hero Background" 
          layout="fill" 
          objectFit="cover" 
          className="brightness-50"
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
                <Image src="/placeholder.svg?height=200&width=400" alt="Itinerary Image" width={400} height={200} className="rounded-md" />
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
                <Image src="/placeholder.svg?height=150&width=300" alt={activity} width={300} height={150} className="rounded-md" />
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
                <Image src="/placeholder.svg?height=200&width=400" alt={place} width={400} height={200} className="rounded-md" />
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


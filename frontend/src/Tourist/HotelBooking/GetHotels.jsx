import { useState } from 'react';
import axiosInstance from '@/axiosInstance.js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './GetHotels.css'; // Import the global styles

const GetHotels = () => {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!city) {
      setError('City is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/api/tourist/getHotels?city=${city}`);
      const data = response.data;
      if (data.hotels) {
        setHotels(data.hotels);
      } else {
        setError('No hotels found for the given city');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px]">
        <img
          src="/placeholder.svg?height=500&width=1920"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Ideal Hotel</h1>
          <p className="text-xl mb-8">Book hotels for your next adventure</p>
          <div className="flex w-full max-w-md space-x-2">
            <Input
              placeholder="Enter City Name"
              className="flex-grow"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </section>

      {/* Hotel Results */}
      {loading ? (
        <div className="text-center mt-12">
          <p className="text-xl">Loading hotels...</p>
        </div>
      ) : (
        <section className="py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Available Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{hotel.name}</CardTitle>
                    <CardDescription>{hotel.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={hotel.imageUrl || "/placeholder.svg?height=200&width=400"}
                      alt={hotel.name}
                      className="w-full h-[200px] object-cover rounded-md"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{hotel.city}</span>
                    </div>
                    <Button onClick={() => navigate(`/hotel/${hotel.id}`)}>View Details</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No hotels found for the specified city.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default GetHotels;

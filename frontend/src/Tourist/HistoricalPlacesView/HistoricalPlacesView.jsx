import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon, Share2Icon } from 'lucide-react'; // Add Share2Icon
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { Header } from '../../components/HeaderTourist';

const HistoricalPlacesView = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [copied, setCopied] = useState(null); // Track copied place URL

  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    EPG: 30,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesResponse, tagsResponse] = await Promise.all([
          axiosInstance.get('/api/guest/historicalPlaces/getHistoricalPlaces'),
          axiosInstance.get('/api/guest/getTags')
        ]);
        
        if (placesResponse.data.historicalPlaces) {
          setPlaces(placesResponse.data.historicalPlaces);
          setFilteredPlaces(placesResponse.data.historicalPlaces);
        }

        if (tagsResponse.data && tagsResponse.data.tags) {
          setAvailableTags(tagsResponse.data.tags);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter(place =>
        selectedTags.every(selectedTag =>
          place.Tags?.some(placeTag => placeTag._id === selectedTag._id)
        )
      );
      setFilteredPlaces(filtered);
    }
  }, [places, selectedTags]);

  const handleTagClick = (tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t._id === tag._id);
      return isSelected
        ? prev.filter(t => t._id !== tag._id)
        : [...prev, tag];
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const convertPrice = (price) => {
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  // Function to handle copying the dynamic URL for each historical place
  const handleShareClick = (placeId) => {
    const url = `http://localhost:5173/historicalplaces/${placeId}`; // Dynamic URL based on place ID
    navigator.clipboard.writeText(url).then(() => {
      setCopied(placeId); // Track the copied place ID
      setTimeout(() => {
        setCopied(null); // Reset copied state after 2 seconds
      }, 2000);
    });
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Historical Places</h1>
            {selectedTags.length > 0 && (
              <Button
                variant="outline"
                onClick={clearTags}
              >
                Clear Tags
              </Button>
            )}
          </div>

          {/* Currency Selector */}
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Select Currency</h2>
            <div className="flex gap-2">
              <Button 
                variant={selectedCurrency === 'USD' ? 'outline' : 'secondary'} 
                onClick={() => handleCurrencyChange('USD')}
              >
                USD
              </Button>
              <Button 
                variant={selectedCurrency === 'EUR' ? 'outline' : 'secondary'} 
                onClick={() => handleCurrencyChange('EUR')}
              >
                EUR
              </Button>
              <Button 
                variant={selectedCurrency === 'GBP' ? 'outline' : 'secondary'} 
                onClick={() => handleCurrencyChange('GBP')}
              >
                GBP
              </Button>
              <Button 
                variant={selectedCurrency === 'EPG' ? 'outline' : 'secondary'} 
                onClick={() => handleCurrencyChange('EPG')}
              >
                EPG
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Filter by Tags</h2>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag._id}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.some(t => t._id === tag._id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredPlaces.length} of {places.length} places
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place._id} className="border rounded-lg shadow-lg overflow-hidden">
              <img
                src={place.Picture}
                alt={place.Name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300';
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{place.Name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{place.Description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{place.Location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{place.Opening_hours} - {place.Closing_hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TicketIcon className="w-4 h-4" />
                    <span>
                      {selectedCurrency === 'USD' && `$${convertPrice(place.Ticket_prices)} USD`}
                      {selectedCurrency === 'EUR' && `€${convertPrice(place.Ticket_prices)} EUR`}
                      {selectedCurrency === 'GBP' && `£${convertPrice(place.Ticket_prices)} GBP`}
                      {selectedCurrency === 'EPG' && `${convertPrice(place.Ticket_prices)} EPG`}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {place.Category}
                  </span>
                </div>

                {place.Tags && place.Tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {place.Tags.map(tag => (
                      <span
                        key={tag._id}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share button for each historical place */}
                <Button
                  variant="outline"
                  onClick={() => handleShareClick(place._id)} // Share specific place URL
                  className="mt-4"
                >
                  <Share2Icon className="w-5 h-5" />
                  Share
                </Button>
                {copied === place._id && <span className="ml-2 text-green-500 text-sm">Link copied!</span>} {/* Feedback */}
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No places match the selected tags</p>
            <Button onClick={clearTags}>Clear Tags</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoricalPlacesView;

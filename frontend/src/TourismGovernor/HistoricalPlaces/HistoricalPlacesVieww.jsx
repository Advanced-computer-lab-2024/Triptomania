import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { Header } from '../../components/GovernerHeader';
const HistoricalPlacesView = () => {
  // States
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesResponse, tagsResponse] = await Promise.all([
          axiosInstance.get('/api/tourismGovernor/getHistoricalPlaces'),
          axiosInstance.get('/api/tourismGovernor/getTags')
        ]);

        if (placesResponse.data.status && placesResponse.data.historicalPlaces) {
          const places = placesResponse.data.historicalPlaces;
          console.log('Places with their tags:');
          places.forEach(place => {
            console.log(`${place.Name} tags:`, place.Tags);
          });
          setPlaces(places);
          setFilteredPlaces(places);
        }

        if (tagsResponse.data && tagsResponse.data.tags) {
          console.log('All Available Tags:', tagsResponse.data.tags);
          setAvailableTags(tagsResponse.data.tags);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply tag filtering
  useEffect(() => {
    console.log('Current selected tags:', selectedTags);
    
    if (selectedTags.length === 0) {
      console.log('No tags selected - showing all places');
      setFilteredPlaces(places);
    } else {
      console.log('Filtering places by tags:', selectedTags.map(tag => tag.name));
      const filtered = places.filter(place => {
        const matches = selectedTags.every(selectedTag =>
          place.Tags?.some(placeTag => placeTag._id === selectedTag._id)
        );
        console.log(`Place "${place.Name}" matches filters:`, matches);
        return matches;
      });
      setFilteredPlaces(filtered);
    }
  }, [places, selectedTags]);

  // Handle tag selection
  const handleTagClick = (tag) => {
    console.log('Tag clicked:', tag.name);
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t._id === tag._id);
      const newTags = isSelected 
        ? prev.filter(t => t._id !== tag._id)
        : [...prev, tag];
      console.log('Updated selected tags:', newTags.map(t => t.name));
      return newTags;
    });
  };

  const clearTags = () => {
    console.log('Clearing all selected tags');
    setSelectedTags([]);
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

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Tags</label>
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

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPlaces.length} of {places.length} places
          </div>
        </div>

        {/* Places Grid */}
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
                    <span>${place.Ticket_prices}</span>
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
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No places match the selected tags</p>
            <Button onClick={clearTags}>Clear Tags</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoricalPlacesView;
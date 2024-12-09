import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon, SearchIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { Header } from '../../components/GovernerHeader';

const HistoricalPlacesViewww = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/tourismGovernor/getHistoricalPlaces');

        if (response.data.status && response.data.historicalPlaces) {
          const myPlaces = response.data.historicalPlaces.filter(
            place => place.creatorId === userId
          );
          setPlaces(myPlaces);
          setFilteredPlaces(myPlaces);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your historical places.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPlaces();
    }
  }, [userId]);

  useEffect(() => {
    const searchResults = places.filter(place =>
      place.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaces(searchResults);
  }, [searchTerm, places]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await axiosInstance.delete('/api/tourismGovernor/deleteHistoricalPlace', {
          data: { id }
        });

        if (response.data.status) {
          setPlaces(places.filter(place => place._id !== id));
          setFilteredPlaces(filteredPlaces.filter(place => place._id !== id));
          alert('Historical place deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting place:', err);
        alert(err.response?.data?.error || 'Failed to delete historical place');
      }
    }
  };

  const handleEdit = (id) => {
    // Placeholder for future edit functionality
    console.log('Edit place:', id);
  };

  if (!userId) return <div>Please log in to view your places</div>;
  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Historical Places</h1>
          </div>

          <div className="relative max-w-md mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search my places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredPlaces.length} of {places.length} places
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place._id} className="border rounded-lg shadow-lg overflow-hidden relative">
              <div className="relative">
                <img
                  src={place.Picture}
                  alt={place.Name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300';
                  }}
                />
                {/* Action buttons container */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {/* Edit button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="transition-colors hover:bg-gray-200"
                    onClick={() => handleEdit(place._id)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  {/* Delete button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="transition-colors hover:bg-red-600"
                    onClick={() => handleDelete(place._id, place.Name)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
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

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No places match your search' : 'You haven\'t created any historical places yet'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoricalPlacesViewww;
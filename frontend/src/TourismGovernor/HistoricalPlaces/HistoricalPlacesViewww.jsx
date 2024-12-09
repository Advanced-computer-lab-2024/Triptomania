import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon, SearchIcon, Trash2Icon, PencilIcon, TagIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { Header } from '../../components/GovernerHeader';
import { useNavigate } from 'react-router-dom';

const HistoricalPlacesViewww = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/tourismGovernor/getMyHistoricalPlaces');
          setPlaces(response.data.historicalPlaces);
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

  const getImageUrl = (picture) => {
    if (!picture) {
      console.log('No picture provided, using placeholder');
      return 'https://via.placeholder.com/300x200';
    }

    try {
      if (picture.startsWith('data:image')) {
        return picture;
      }

      if (picture.match(/^[A-Za-z0-9+/=]+$/)) {
        return `data:image/jpeg;base64,${picture}`;
      }

      if (picture.startsWith('http')) {
        if (picture.includes('example.com')) {
          return 'https://via.placeholder.com/300x200';
        }
        return picture;
      }

      return picture;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return 'https://via.placeholder.com/300x200';
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await axiosInstance.delete('/api/tourismGovernor/deleteHistoricalPlace', {
          data: { id }
        });

        if (response.data.status) {
          alert('Historical place deleted successfully');
          window.location.reload();
        }
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete historical place');
      }
    }
  };

  const handleEdit = (id) => {
    // Placeholder for future edit functionality
    console.log('Edit place:', id);
  };

  if (loading) return <Loading />;

  return (
    <div className="view-itineraries">
      <Header />
      <div className="content">
        <main className="itineraries">
          {loading ? (
            <Loading />
          ) : (
            places.length > 0 ? (
              places.map((place) => (
                <div className="activity-card" key={place._id}>
                  <div className="activity-image-container">
                    <img
                      src={getImageUrl(place.Picture)}
                      alt={place.Name}
                      className="activity-image"
                      onError={(e) => {
                        console.log(`Image load error for ${place.Name}`);
                        e.target.src = 'https://via.placeholder.com/300x200';
                      }}
                    />
                  </div>
                  <div className="activity-details">
                    <div className="activity-header">
                      <h2 className="activity-title">{place.Name}</h2>
                    </div>
                    <p className="activity-description">{place.Description}</p>
                    <div className="activity-info">
                      <p>
                        <MapPinIcon className="icon" />
                        {place.Location}
                      </p>
                      <p>
                        <ClockIcon className="icon" />
                        Opening Hours: {place.Opening_hours} - {place.Closing_hours}
                      </p>
                      <p>
                        <TagIcon className="icon" />
                        {place.Tags
                          ?.map((tag) => {
                            return tag ? tag.name : null;
                          })
                          .filter((tagName) => tagName)
                          .join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div className="activity-footer">
                    <p className="activity-price">${place.Ticket_prices.toFixed(2)} USD</p>
                    <Button 
                      className="edit-button"
                      onClick={() => navigate(`/tourismGovernor/editHistoricalPlace/${place._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="delete-button"
                      onClick={() => handleDelete(place._id, place.Name)} // Call delete handler
                    >
                      Delete
                    </Button>
                  </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No historical places found matching your criteria</p>
                <Button onClick={handleResetFilters}>Reset Filters</Button>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default HistoricalPlacesViewww;
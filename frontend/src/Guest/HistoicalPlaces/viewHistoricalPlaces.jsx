import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Header } from '../../components/Header';
import Loading from "@/components/Loading";
import './viewHistoricalPlaces.css';

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

const ViewHistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [allHistoricalPlaces, setAllHistoricalPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [placesResponse, tagsResponse] = await Promise.all([
          axiosInstance.get('/api/guest/historicalPlaces/getHistoricalPlaces'),
          axiosInstance.get('/api/guest/getTags')
        ]);

        console.log('Initial Places Data:', placesResponse.data);
        console.log('Available Tags:', tagsResponse.data);

        if (placesResponse.data.historicalPlaces) {
          setAllHistoricalPlaces(placesResponse.data.historicalPlaces);
          setHistoricalPlaces(placesResponse.data.historicalPlaces);
        }

        if (tagsResponse.data && tagsResponse.data.tags) {
          setAvailableTags(tagsResponse.data.tags);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply tag filtering
  useEffect(() => {
    try {
      setIsFilterLoading(true);
      if (selectedTags.length === 0) {
        setHistoricalPlaces(allHistoricalPlaces);
      } else {
        const filtered = allHistoricalPlaces.filter(place => 
          place.Tags?.some(tag => 
            selectedTags.some(st => 
              st._id === (typeof tag === 'string' ? tag : tag?._id)
            )
          )
        );
        setHistoricalPlaces(filtered);
      }
    } catch (error) {
      console.error('Error applying tag filters:', error);
      setError('Failed to apply filters');
    } finally {
      setIsFilterLoading(false);
    }
  }, [selectedTags, allHistoricalPlaces]);

  const handleTagChange = (tag) => {
    if (!tag?._id) {
      console.error('Invalid tag:', tag);
      return;
    }

    setSelectedTags(prev => {
      const newTags = prev.some(t => t._id === tag._id)
        ? prev.filter(t => t._id !== tag._id)
        : [...prev, tag];
      return newTags;
    });
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setHistoricalPlaces(allHistoricalPlaces);
  };

  const renderTags = (place) => {
    if (!place.Tags || !Array.isArray(place.Tags) || place.Tags.length === 0) {
      return null;
    }

    return (
      <div className="place-tags">
        {place.Tags.map(tagId => {
          const tagIdentifier = typeof tagId === 'string' ? tagId : tagId?._id;
          if (!tagIdentifier) return null;

          const tag = availableTags.find(t => t._id === tagIdentifier);
          return tag ? (
            <span key={tagIdentifier} className="tag-badge">
              {tag.name}
            </span>
          ) : null;
        })}
      </div>
    );
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="view-activities">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by Tags</h3>

          {/* Tags Filter */}
          <div className="mb-4">
            <Label>Tags ({selectedTags.length} selected)</Label>
            <div className="tags-filter">
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <div key={tag._id} className="tag-option">
                    <input
                      type="checkbox"
                      id={`tag-${tag._id}`}
                      checked={selectedTags.some(t => t._id === tag._id)}
                      onChange={() => handleTagChange(tag)}
                      disabled={isFilterLoading}
                    />
                    <Label htmlFor={`tag-${tag._id}`} className="ml-2">
                      {tag.name}
                    </Label>
                  </div>
                ))
              ) : (
                <p>No tags available</p>
              )}
            </div>
          </div>

          {/* Reset Filters Button */}
          {selectedTags.length > 0 && (
            <Button 
              onClick={handleResetFilters} 
              className="w-full"
              disabled={isFilterLoading}
            >
              Reset Filters
            </Button>
          )}
        </aside>

        <main className="activities">
          {loading || isFilterLoading ? (
            <Loading />
          ) : (
            historicalPlaces.length > 0 ? (
              historicalPlaces.map((place) => (
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
                      <span className="category-badge">{place.Category}</span>
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
                      {renderTags(place)}
                    </div>
                    <div className="activity-footer">
                      <p className="ticket-price">
                        <TicketIcon className="icon" />
                        Price: ${place.Ticket_prices}
                      </p>
                      <Button className="btn-primary">Book Now</Button>
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

export default ViewHistoricalPlaces;
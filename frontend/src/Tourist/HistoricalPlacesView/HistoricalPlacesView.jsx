import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, TicketIcon, TagIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Header } from '../../components/HeaderTourist';
import Loading from "@/components/Loading";

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
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD'); // Currency state

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [placesResponse, tagsResponse] = await Promise.all([
        axiosInstance.get('/api/tourist/getHistoricalPlaces'),
        axiosInstance.get('/api/tourist/getTags')
      ]);

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

  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    INR: 30,
  };

  const convertPrice = (price) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  const filterHistoricalPlaces = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/tourist/historicalPlaces/filterHistoricalPlaces?tags=${tags.join(',')}`);
      if (response.status === 200) {
        setHistoricalPlaces(response.data.historicalPlaces);
      }
    } catch (error) {
      alert('Failed to filter historical places. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleFilterClick = () => {
    filterHistoricalPlaces();
  };

  const handleFilterReset = () => {
    setTags([]);
    fetchData();
  };

  const handleTagsChange = (tag) => {
    setTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((p) => p !== tag);
      } else {
        return [...prev, tag];
      }
    });
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
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>

          {/* Currency Dropdown */}
          <div className="currency-dropdown mb-4">
            <Label>Currency</Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div className="mb-4">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag._id}
                  variant={tags.includes(tag._id) ? 'primary' : 'outline'}
                  onClick={() => handleTagsChange(tag._id)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleFilterClick} className="mt-4">Apply Filters</Button>
          <Button onClick={handleFilterReset} className="mt-4">Reset Filters</Button>
        </aside>

        <main className="activities">
          {loading ? (
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
                      <p className="ticket-price">
                        <TicketIcon className="icon" />
                        Price: {currency} &nbsp;{convertPrice(place.Ticket_prices)}
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
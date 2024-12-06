import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import { MapPinIcon, ClockIcon, BuildingIcon, StarIcon, TicketIcon, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from '../../components/Header';
import Loading from "@/components/Loading";
import './viewHistoricalPlaces.css';

const getImageUrl = (picture) => {
  if (!picture) {
    return 'https://via.placeholder.com/300x200';
  }
  
  try {
    // If it's already a complete data URL
    if (picture.startsWith('data:image')) {
      return picture;
    }
    
    // If it's a base64 string
    if (picture.match(/^[A-Za-z0-9+/=]+$/)) {
      return `data:image/jpeg;base64,${picture}`;
    }
    
    // If it's a URL (for your existing data)
    if (picture.startsWith('http')) {
      // For now, return a placeholder for example.com URLs
      if (picture.includes('example.com')) {
        return 'https://via.placeholder.com/300x200';
      }
      return picture;
    }
    
    return picture;
  } catch (error) {
    console.error('Error processing image:', error);
    return 'https://via.placeholder.com/300x200';
  }
};
const ViewHistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [allHistoricalPlaces, setAllHistoricalPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await axiosInstance.get('/api/guest/historicalPlaces/getHistoricalPlaces');

      if (response.data.historicalPlaces) {
        setAllHistoricalPlaces(response.data.historicalPlaces);
        setHistoricalPlaces(response.data.historicalPlaces);
      } else {
        console.error('No historical places in response');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical places:', error);
      setLoading(false);
    }
};
  const handleSearch = async (name) => {
    if (!name) {
      fetchHistoricalPlaces();
      return;
    }
    
    try {
      const response = await axiosInstance.get(`/api/guest/historicalPlaces/searchHistoricalPlaces`, {
        params: { Name: name },
      });
      setHistoricalPlaces(response.data);
    } catch (error) {
      console.error('Error searching historical places:', error);
    }
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedPlaces = [...historicalPlaces].sort((a, b) => {
      if (value === 'asc') {
        return a.Name.localeCompare(b.Name);
      } else {
        return b.Name.localeCompare(a.Name);
      }
    });
    setHistoricalPlaces(sortedPlaces);
  };

  const handleImageError = (placeId) => {
    setImageErrors(prev => ({
      ...prev,
      [placeId]: true
    }));
  };

  const handleImageLoad = (placeId) => {
    setLoadedImages(prev => ({
      ...prev,
      [placeId]: true
    }));
  };

  return (
    <div className="view-activities">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>

          <div className="mb-4">
            <Label>Category</Label>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="museum" id="category-museum" />
                <Label htmlFor="category-museum">Museum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monument" id="category-monument" />
                <Label htmlFor="category-monument">Monument</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archaeological" id="category-archaeological" />
                <Label htmlFor="category-archaeological">Archaeological Site</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label>Sort by</Label>
            <RadioGroup value={sortOrder} onValueChange={handleSortChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="sort-asc" />
                <Label htmlFor="sort-asc">A to Z</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="sort-desc" />
                <Label htmlFor="sort-desc">Z to A</Label>
              </div>
            </RadioGroup>
          </div>
        </aside>

        <main className="activities">
          <div className="search-bar">
            <Input
              type="text"
              placeholder="Search historical places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
          </div>

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
               
                    </div>
                    <div className="activity-footer">
                      <p className="ticket-price">
                      <TicketIcon className="icon" />
                        Entry Fee: ${place.Ticket_prices}
                      </p>
                      <Button className="book-button">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No historical places found.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewHistoricalPlaces;
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewItineraries.css';
import { CalendarIcon, MapPinIcon, TagIcon, Languages, StarIcon, FlagIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading'; // Import the loading component
import { Header } from '@/components/AdminHeader'; // Import the Header component

const ViewItinerariesAdmin = () => {
  const [itineraries, setItineraries] = useState([]);
  const [allItineraries, setAllItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [budgetRange, setBudgetRange] = useState([0, 5000]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [preferenceTags, setPreferenceTags] = useState([]); // State for preference tags
  const [sortOrder, setSortOrder] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllItineraries();
    fetchPreferenceTags(); // Fetch preference tags on component mount
  }, []);

  const fetchAllItineraries = async () => {
    setLoading(true); // Show loading indicator while fetching itineraries
    try {
      const response = await axiosInstance.get('/api/admin/itineraries/viewItineraries');
      setAllItineraries(response.data.itineraries || []);
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error.response?.data || error.message);
    } finally {
      setLoading(false); // Hide loading indicator once data is fetched
    }
  };

  const fetchFilteredItineraries = async () => {
    setLoading(true); // Show loading indicator while fetching filtered itineraries
    try {
      const filters = {
        minPrice: budgetRange[0],
        maxPrice: budgetRange[1],
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        preferences: preferences.join(','),
        language: selectedLanguage,
      };

      const query = Object.keys(filters)
        .filter((key) => filters[key]) // Include only non-empty filters
        .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
        .join('&');

      const response = await axiosInstance.get(`/api/guest/itineraries/filterItineraries?${query}`);

      if (response.status === 200 && Array.isArray(response.data) && response.data.length === 0) {
        setItineraries([]); // No itineraries found for the filter
      } else if (response.status === 200) {
        setItineraries(response.data || []);
      } else {
        setItineraries([]); // Handle unexpected response
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setItineraries([]); // Handle 404 explicitly
      } else {
        console.error('Error fetching filtered itineraries:', error.response?.data || error.message);
      }
    } finally {
      setLoading(false); // Hide loading indicator once data is fetched
    }
  };

  const fetchSortedItineraries = async () => {
    try {
      let apiLink = '/api/guest/itineraries/sortItineraries';
      if (sortBy && sortOrder) {
        apiLink += `?sortBy=${sortBy}`;
        apiLink += `&order=${sortOrder}`;
      }
      const response = await axiosInstance.get(apiLink);
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching sorted itineraries:', error);
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const response = await axiosInstance.get('/api/guest/itineraries/getTags');
      setPreferenceTags(response.data || []);
    } catch (error) {
      console.error('Error fetching preference tags:', error.response?.data || error.message);
    }
  };

  const handleFlagItinerary = async (id) => {
    try {
      const response = await axiosInstance.put('/api/admin/flagitinerary', { id });
      if (response.status === 200) {
        fetchAllItineraries(); // Refresh itineraries
        const message = response.data.message;
        alert(message);
      }
    } catch (error) {
      console.error('Error flagging itinerary:', error.response?.data || error.message);
      alert(`Error flagging itinerary: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleFilterClick = () => {
    fetchFilteredItineraries();
  };

  const handleFilterReset = () => {
    setSelectedDate(null);
    setBudgetRange([0, 5000]);
    setSelectedLanguage('');
    setPreferences([]);
    setSearchTerm('');
    setSortBy('');
    setSortOrder('');
    fetchAllItineraries();
  };

  const handleSortClick = () => {
    fetchSortedItineraries();
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const handlePreferencesChange = (preference) => {
    setPreferences((prev) => {
      if (prev.includes(preference)) {
        return prev.filter((p) => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = allItineraries.filter((itinerary) =>
      itinerary.Name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setItineraries(filtered);
  };

  return (
    <div className="view-itineraries">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>

          <div className="mb-4">
            <Label>Budget Range</Label>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={budgetRange}
              onValueChange={setBudgetRange}
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${budgetRange[0]}</span>
              <span>${budgetRange[1]}</span>
            </div>
          </div>

          <div className="mb-4">
            <Label>Language</Label>
            <Input
              type="text"
              placeholder="Enter preferred language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label>Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {preferenceTags.map((preference) => (
                <Button
                  key={preference._id}
                  variant={preferences.includes(preference._id) ? 'primary' : 'outline'}
                  onClick={() => handlePreferencesChange(preference._id)}
                >
                  {preference.PreferenceTagName}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="mb-4">
            <Label>Sort by</Label>
            <RadioGroup value={sortBy} onValueChange={handleSortByChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price" id="sort-price" />
                <Label htmlFor="sort-price">Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="sort-rating" />
                <Label htmlFor="sort-rating">Rating</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="mb-4">
            <Label>Order</Label>
            <RadioGroup value={sortOrder} onValueChange={handleSortOrderChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="sort-asc" />
                <Label htmlFor="sort-asc">Lowest to Highest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="sort-desc" />
                <Label htmlFor="sort-desc">Highest to Lowest</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={handleFilterClick} className="mt-4">Apply Filters</Button>
          <Button onClick={handleFilterReset} className="mt-4">Reset Filters</Button>
          <Button onClick={handleSortClick} className="mt-4">Apply Sort</Button>
        </aside>
        <main className="itineraries">
          <div className="search-bar mb-4">
            <Input
              type="text"
              placeholder="Search itineraries..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          {loading || !preferenceTags.length ? (
            <Loading /> // Display loading component while fetching itineraries
          ) : itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <div className="itinerary-card" key={itinerary._id}>
                <div className="itinerary-image-container">
                  <img
                    src={itinerary.Picture || 'https://via.placeholder.com/300x200'}
                    alt={itinerary.Name}
                    className="itinerary-image"
                  />
                </div>
                <div className="itinerary-details">
                  <div className="itinerary-header">
                    <h2 className="itinerary-title">{itinerary.Name}</h2>
                    <div className="itinerary-rating">
                      <StarIcon className="icon" />
                      <span>{itinerary.averageRating || 'N/A'}</span>
                    </div>
                    <div className="itinerary-flag">
                      <FlagIcon
                        className="flag-icon"
                        color={itinerary.isFlagged ? 'red' : 'gray'}
                        onClick={() => handleFlagItinerary(itinerary._id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  <p>{itinerary.Description}</p>
                  <div className="itinerary-info">
                    <p>
                      <CalendarIcon className="icon" />
                      {itinerary.Start_date
                        ? new Date(itinerary.Start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Date not available'}
                    </p>
                    <p>
                      <MapPinIcon className="icon" />
                      {itinerary.locationsToVisit?.[0] || 'Location not available'}
                    </p>
                    <p>
                      <Languages className="icon" />
                      {itinerary.language}
                    </p>
                    <p>
                      <TagIcon className="icon" />
                      {itinerary.preferenceTags
                        ?.map((tagId) => {
                          const tag = preferenceTags.find(c => c._id === tagId);
                          return tag ? tag.PreferenceTagName : null;
                        })
                        .filter((tagName) => tagName)
                        .join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="itinerary-footer">
                    <p className="itinerary-price">${itinerary.price} USD</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No itineraries found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewItinerariesAdmin;

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewItineraries.css';
import { Header } from '../../components/Header';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';

const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [allItineraries, setAllItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [budgetRange, setBudgetRange] = useState([0, 5000]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllItineraries();
  }, []);

  const fetchAllItineraries = async () => {
    try {
      const response = await axiosInstance.get('/api/guest/itineraries/viewItineraries');
      setAllItineraries(response.data.itineraries || []);
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error.response?.data || error.message);
    }
  };

  const fetchFilteredItineraries = async () => {
    try {
      const filters = {
        budgetMin: budgetRange[0],
        budgetMax: budgetRange[1],
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        preferences: preferences.join(','),
        language: selectedLanguage,
      };

      const query = Object.keys(filters)
        .filter((key) => filters[key]) // Include only non-empty filters
        .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
        .join('&');

      console.log("Filter query:", query); // Debugging to ensure query is correct

      const response = await axiosInstance.get(`/api/guest/itineraries/filter?${query}`);
      console.log("Filtered itineraries response:", response.data); // Debug response data
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Error fetching filtered itineraries:', error.response?.data || error.message);
    }
  };

  const handleFilterClick = () => {
    console.log("Applying filters...");
    fetchFilteredItineraries();
  };

  const handleFilterReset = () => {
    setSelectedDate(null);
    setBudgetRange([0, 5000]);
    setSelectedLanguage('');
    setPreferences([]);
    setSearchTerm('');
    fetchAllItineraries();
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
              {['Historic Areas', 'Beaches', 'Family-Friendly', 'Shopping'].map((preference) => (
                <Button
                  key={preference}
                  variant={preferences.includes(preference) ? 'primary' : 'outline'}
                  onClick={() => handlePreferencesChange(preference)}
                >
                  {preference}
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

          <Button onClick={handleFilterClick} className="mt-4">Apply Filters</Button>
          <Button onClick={handleFilterReset} className="mt-4">Reset Filters</Button>
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
          {itineraries.length > 0 ? (
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
                  <h2 className="itinerary-title">{itinerary.Name}</h2>
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
                  </div>
                  <div className="itinerary-footer">
                    <p className="itinerary-price">${itinerary.price} USD</p>
                    <Button
                      className="book-button"
                      onClick={() => navigate('/login')}
                    >
                      Book Itinerary
                    </Button>
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

export default ViewItineraries;
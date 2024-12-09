import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewItinerariesTourist.css';
import { Header } from '../../components/HeaderTourist';
import { 
  CalendarIcon, 
  MapPinIcon, 
  Languages, 
  StarIcon, 
  Bookmark, 
  BookmarkCheck 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';

const ViewItinerariesTourist = () => {
  const [itineraries, setItineraries] = useState([]);
  const [allItineraries, setAllItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [budgetRange, setBudgetRange] = useState([0, 5000]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // State for selected currency
  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    EPG: 30,
  };

  useEffect(() => {
    fetchAllItineraries();
  }, []);
  const fetchBookmarkedEvents = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/events/getBookmarkedEvents');
      const bookmarkedIds = new Set(
        response.data.bookmarkedEvents.itineraries.map(itinerary => itinerary._id)
      );
      setBookmarkedItineraries(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarked events:', error);
    }
  };
  const handleBookmarkToggle = async (itineraryId, e) => {
    e.stopPropagation(); // Prevent event bubbling
  
    if (loading) return; // Prevent multiple rapid clicks
    setLoading(true); // Indicate the operation is in progress
  
    try {
      if (bookmarkedItineraries.has(itineraryId)) {
        // Unbookmark
        setBookmarkedItineraries((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itineraryId);
          return newSet;
        });
  
        await axiosInstance.put('/api/tourist/events/unbookmarkEvent', {
          eventId: itineraryId,
          eventType: 'itinerary',
        });
      } else {
        // Bookmark
        setBookmarkedItineraries((prev) => new Set([...prev, itineraryId]));
  
        await axiosInstance.post('/api/tourist/events/bookmarkEvent', {
          eventId: itineraryId,
          eventType: 'itinerary',
        });
      }
  
      // Optionally, re-fetch to ensure the state is synced with the backend
      // fetchBookmarkedEvents();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('An error occurred while updating your bookmarks. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  
  const fetchAllItineraries = async () => {
    setLoading(true); // Show loading indicator while fetching itineraries
    try {
      const response = await axiosInstance.get('/api/tourist/itineraries/viewItineraries');
      setAllItineraries(response.data.itineraries || []);
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error.response?.data || error.message);
    } finally {
      setLoading(false); // Hide loading indicator once data is fetched
    }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const convertPrice = (price) => {
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  const handleFilterClick = () => {
    fetchFilteredItineraries();
  };

  const handleFilterReset = () => {
    setSelectedDate(null);
    setBudgetRange([0, 5000]);
    setSelectedLanguage('');
    setSearchTerm('');
    setSortBy('');
    setSortOrder('');
    fetchAllItineraries();
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    fetchSortedActivities();
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    fetchSortedActivities();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = allItineraries.filter((itinerary) =>
      itinerary.Name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setItineraries(filtered);
  };

  const handleBookActivity = async (itineraryId) => {
    try {
      const { data } = await axiosInstance.put('/api/tourist/bookItinerary', { itineraryId });
      setShowSuccessMessage(true);
      console.log(data.message); // Log the success message
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage === "You have already booked this activity") {
        console.error("Itinerary already booked");
        alert("You have already booked this activity.");
      } else {
        console.error('Error booking activity:', errorMessage);
        alert("An error occurred OR You have already booked this Itinerary");
      }
    }
  };

  return (
    <div className="view-itineraries">
      <Header />
      
      {/* Currency Selector at the top right */}
      <div className="currency-selector">
        <Button variant={selectedCurrency === 'USD' ? 'outline' : 'secondary'} onClick={() => handleCurrencyChange('USD')}>USD</Button>
        <Button variant={selectedCurrency === 'EUR' ? 'outline' : 'secondary'} onClick={() => handleCurrencyChange('EUR')}>EUR</Button>
        <Button variant={selectedCurrency === 'GBP' ? 'outline' : 'secondary'} onClick={() => handleCurrencyChange('GBP')}>GBP</Button>
        <Button variant={selectedCurrency === 'EPG' ? 'outline' : 'secondary'} onClick={() => handleCurrencyChange('EPG')}>EPG</Button>
      </div>

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

          {loading ? (
            <Loading /> // Display loading component while fetching itineraries
          ) : itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <div className="itinerary-card" key={itinerary._id}>
              <div className="itinerary-image-container relative">
  <img
    src={itinerary.Picture || 'https://via.placeholder.com/300x200'}
    alt={itinerary.Name}
    className="itinerary-image"
  />
  <Button
    variant="ghost"
    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
    onClick={(e) => handleBookmarkToggle(itinerary._id, e)}
  >
    {bookmarkedItineraries.has(itinerary._id) ? (
      <BookmarkCheck className="h-6 w-6 text-primary" />
    ) : (
      <Bookmark className="h-6 w-6" />
    )}
  </Button>
</div>
                <div className="itinerary-details">
                  <div className="itinerary-header">
                    <h2 className="itinerary-title">{itinerary.Name}</h2>
                    <div className="itinerary-rating">
                      <StarIcon className="icon" />
                      <span>{itinerary.averageRating || 'N/A'}</span>
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
                  </div>
                  <div className="itinerary-footer">
                    <p className="itinerary-price">
                      {selectedCurrency} {convertPrice(itinerary.price)}
                    </p>
                    <Button
                      className="book-button"
                      onClick={() => handleBookActivity(itinerary._id)} x>
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

      {showSuccessMessage && (
        <div className="success-message">
          <p>Itinerary booked successfully! Go to your account to complete your payment.</p>
          <Button onClick={() => setShowSuccessMessage(false)}>Close</Button>
        </div>
      )}
    </div>
  );
};

export default ViewItinerariesTourist;

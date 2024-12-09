import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewActivitiesTourist.css';
import { Header } from '../../components/HeaderTourist';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import Loading from '@/components/Loading';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  MapPinIcon,
  Languages,
  StarIcon,
  Bookmark,
  TagIcon,
  BookmarkCheck,
  Share2Icon
} from 'lucide-react';




const ViewActivitiesTourist = () => {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic categories
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currency, setCurrency] = useState('USD'); // Currency state
  const [bookmarkedActivities, setBookmarkedActivities] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null); // Track copied place URL


  const navigate = useNavigate();

  useEffect(() => {
    fetchAllActivities();
    fetchCategories(); // Fetch categories dynamically
    fetchBookmarkedActivities(); // Fetch bookmarked activities
  }, []);
  const fetchBookmarkedActivities = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/events/getBookmarkedEvents');
      setBookmarkedActivities(response.data.bookmarkedEvents.activities);
      console.log(bookmarkedActivities);
    } catch (error) {
      console.error('Error fetching bookmarked events:', error);
    }
  };

  // Function to handle copying the dynamic URL for each historical place
  const handleShareClick = (placeId) => {
    const url = `http://localhost:5173/activity/${placeId}`; // Dynamic URL based on place ID
    navigator.clipboard.writeText(url).then(() => {
      setCopied(placeId); // Track the copied place ID
      setTimeout(() => {
        setCopied(null); // Reset copied state after 2 seconds
      }, 2000);
    });
  };

  const handleBookmarkToggle = async (activityId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (loading) return; // Prevent multiple rapid clicks

    setLoading(true); // Start loading

    try {
      const requestData = {
        eventId: activityId,
        eventType: 'activity'
      };

      if (bookmarkedActivities.value?.includes(String(activityId))) {
        // Optimistically update the state
        const updatedBookmarks = new Set(bookmarkedActivities);
        updatedBookmarks.delete(activityId);
        setBookmarkedActivities(updatedBookmarks); // Update local state

        // Unbookmark server request
        const response = await axiosInstance.put('/api/tourist/events/unbookmarkEvent', requestData);
      } else {
        // Optimistically update the state
        const updatedBookmarks = new Set(bookmarkedActivities);
        updatedBookmarks.add(activityId);
        setBookmarkedActivities(updatedBookmarks); // Update local state

        // Bookmark server request
        const response = await axiosInstance.post('/api/tourist/events/bookmarkEvent', requestData);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('An error occurred while updating your bookmarks. Please try again.');
      fetchBookmarkedActivities(); // Revert the optimistic update
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const fetchAllActivities = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/activity/viewActivities');
      setAllActivities(response.data);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching all activities:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/activities/getCategories');
      setCategories(response.data); // Dynamically populate categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFilteredActivities = async () => {
    try {
      let apiLink = '/api/tourist/activity/filterActivities';
      let queryParams = [];

      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        let minPrice = priceRange[0];
        let maxPrice = priceRange[1];
        queryParams.push(`minPrice=${minPrice}&maxPrice=${maxPrice}`);
      }
      if (selectedDate) {
        queryParams.push(`date=${selectedDate}`);
      }
      if (selectedCategory) {
        queryParams.push(`category=${selectedCategory}`);
      }
      if (selectedRating) {
        queryParams.push(`ratings=${selectedRating}`);
      }

      if (queryParams.length > 0) {
        apiLink += '?' + queryParams.join('&');
      }

      const response = await axiosInstance.get(apiLink);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching filtered activities:', error);
    }
  };

  const fetchSortedActivities = async () => {
    try {
      let apiLink = '/api/tourist/activity/sortActivities';
      if (sortBy && sortOrder) {
        apiLink += `?sortBy=${sortBy}`;
        apiLink += `&order=${sortOrder}`;
      }
      const response = await axiosInstance.get(apiLink);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching sorted activities:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = () => {
    fetchFilteredActivities();
  };

  const handleFilterReset = () => {
    // Reset all filters
    setSelectedDate(null);
    setPriceRange([0, 1000]);
    setSelectedRating('');
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('');
    setSortOrder('');
    fetchAllActivities();
  };

  const handleSortClick = () => {
    fetchSortedActivities();
  };

  const handleSortReset = () => {
    // Reset all filters
    setSortBy('');
    setSortOrder('');
    fetchAllActivities();
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    fetchSortedActivities();
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    fetchSortedActivities();
  };

  const handleBookActivity = async (activityId) => {
    try {
      const { data } = await axiosInstance.put('/api/tourist/bookActivity', { activityId });
      setShowSuccessMessage(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage === "You have already booked this activity") {
        console.error("Activity already booked");
        // Optionally, show a message to the user
        alert("You have already booked this activity.");
      } else {
        console.error('Error booking activity:', errorMessage);
        alert("You have already booked this activity");
      }
    }
  };

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
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="mb-4">
            <Label>Rating</Label>
            <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>
                    {rating} {rating === 1 ? 'star' : 'stars'} & up
                  </Label>
                </div>
              ))}
            </RadioGroup>
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

          <div className="mb-4">
            <Label>Category</Label>
            {categories.length > 0 ? (
              <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category._id} id={`category-${category._id}`} />
                    <Label htmlFor={`category-${category._id}`}>{category.CategoryName}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p>Loading categories...</p>
            )}
          </div>

          <Button onClick={handleFilterClick} id="filter">Apply Filters</Button>
          <Button onClick={handleFilterReset} id="filter">Reset Filters</Button>
          <Button onClick={handleSortClick} id="filter">Apply Sort</Button>
        </aside>

        <main className="activities">
          <div className="search-bar mb-4">
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          {activities.length > 0 ? (
            activities.map((activity) => (
              (bookmarkedActivities, activity._id),
              <div className="activity-card" key={activity._id}>
                <div className="activity-image-container relative">
                  <img
                    src={activity.Picture || 'https://via.placeholder.com/300x200'}
                    alt={activity.Name}
                    className="activity-image"
                  />
                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
                    onClick={(e) => handleBookmarkToggle(activity._id, e)}
                  >
                    {bookmarkedActivities.value?.includes(String(activity._id)) ? (
                      <BookmarkCheck className="h-6 w-6 text-primary" />
                    ) : (
                      <Bookmark className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                <div className="activity-details">
                  <div className="activity-header">
                    <h2 className="activity-title">{activity.name}</h2>
                    <div className="activity-rating">
                      <StarIcon className="icon" />
                      <span>{activity.averageRating || 'N/A'}</span>
                    </div>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-info">
                    <p>
                      <CalendarIcon className="icon" />
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                    <p>
                      <MapPinIcon className="icon" />
                      {activity.location}
                    </p>
                    <p>
                      <TagIcon className="icon" />
                      {categories.find(c => c._id === activity.category)?.CategoryName || 'N/A'}
                    </p>
                  </div>
                  <div className="activity-footer">
                    <p className="activity-price">{currency} {activity.price.toFixed(2)}</p>
                    {/* Share button for each historical place */}
                    <Button
                      variant="outline"
                      onClick={() => handleShareClick(activity._id)} // Share specific place URL
                      className="mt-4"
                    >
                      <Share2Icon className="w-5 h-5" />
                      Share
                    </Button>
                    {copied === activity._id && <span className="ml-2 text-green-500 text-sm">Link copied!</span>} {/* Feedback */}
                    <Button
                      className="book-button"
                      onClick={() => handleBookActivity(activity._id)} x>
                      Book Activity
                    </Button>


                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No activities found.</p>
          )}
        </main>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          <p>Activity booked successfully! Go to your account to complete your payment.</p>
          <Button onClick={() => setShowSuccessMessage(false)}>Close</Button>
        </div>
      )}
    </div>
  );
};

export default ViewActivitiesTourist;


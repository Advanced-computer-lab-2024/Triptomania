import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewActivities.css';
import { Header } from '../../components/Header';
import { CalendarIcon, MapPinIcon, TagIcon, StarIcon } from 'lucide-react';
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

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]); // Store all activities
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();  // Initialize navigate function

  const handleSignInClick = () => {
    navigate("/login");  // Navigate to the Login page on button click
  };
  useEffect(() => {
    fetchAllActivities(); // Fetch all activities when the component mounts
  }, []);

  const fetchAllActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/guest/activities/viewActivities');
      setAllActivities(response.data); // Store all activities
      setActivities(response.data); // Initially show all activities
    } catch (error) {
      console.error('Error fetching all activities:', error);
    }
  };

  const fetchFilteredActivities = async () => {
    try {
      const params = {};
  
      // Send both min and max values for the price range
      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        params.minPrice = priceRange[0];  // Minimum price
        params.maxPrice = priceRange[1];  // Maximum price
      }
  
      // Add the selected date, category, and rating to the params if set
      if (selectedDate) params.date = selectedDate.toISOString();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedRating) params.ratings = selectedRating;
  
      const response = await axios.get('http://localhost:5000/api/guest/activities/filterActivities', {
        params: params, // Send only parameters that are set
      });
  
      setActivities(response.data); // Update activities with the filtered results
    } catch (error) {
      console.error('Error fetching filtered activities:', error);
    }
};

const fetchSortedActivities = async (sortOrder) => {
  try {
    const params = {
      sortOrder: sortOrder,
    };

    const response = await axios.get('http://localhost:5000/api/guest/activities/sortActivities', {
      params: params,
    });
    setActivities(response.data); // Update activities with the sorted results
  } catch (error) {
    console.error('Error fetching sorted activities:', error);
  }
};
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Optionally trigger search logic based on search term
  };

  const handleFilterClick = () => {
    fetchFilteredActivities(); // Trigger the filter API when the button is clicked
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    fetchSortedActivities(value); // Trigger the sort API when the value changes
  };
 
 

  return (
    <div className="view-activities">
      <Header />
      <div className="content">
        <aside className="filters">
          <h3 className="text-lg font-semibold mb-4">Filter by:</h3>
          
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

            <RadioGroup value={sortOrder} onValueChange={handleSortChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="sort-asc" />
                <Label htmlFor="sort-asc">Lowest to Highest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="sort-desc" />
                <Label htmlFor="sort-desc">Highest to Lowest</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mb-4">
            <Label>Category</Label>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              {['Adventure', 'Relaxation', 'Cultural', 'Food & Drink'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={`category-${category}`} />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={handleFilterClick} className="mt-4">Apply Filters</Button> {/* Filter Button */}
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
              <div className="activity-card" key={activity._id}>
                <div className="activity-image-container">
                  <img
                    src={activity.image || 'https://via.placeholder.com/300x200'}
                    alt={activity.name}
                    className="activity-image"
                  />
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
                      {activity.category?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="activity-footer">
                    <p className="activity-price">${activity.price.toFixed(2)} USD</p>
                    <Button className="book-button" onClick={handleSignInClick}>
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
    </div>
  );
};

export default ViewActivities;

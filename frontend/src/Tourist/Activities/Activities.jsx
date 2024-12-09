import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './Activities.css';
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

const Activities = () => {
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
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    fetchAllActivities();
    fetchCategories(); // Fetch categories dynamically
  }, []);

  const fetchAllActivities = async () => {
    try {
      const response = await axiosInstance.get('/api/tourist/activities/viewActivities');
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
      let apiLink = '/api/tour/activities/filterActivities';
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
      let apiLink = '/api/tourist/activities/sortActivities';
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
          <br></br>
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
                      {categories.find(c => c._id === activity.category)?.CategoryName || 'N/A'}
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

export default Activities;
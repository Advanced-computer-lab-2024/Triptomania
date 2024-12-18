import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewMyActivities.css';
import { Header } from '../../components/AdvertiserHeader';
import { CalendarIcon, MapPinIcon, TagIcon, StarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

const ViewActivities = () => {
  const [activities, setActivities] = useState([]); // Filtered activities
  const [allActivities, setAllActivities] = useState([]); // All activities
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/advertiser/editactivity/${id}`);
  };

  useEffect(() => {
    fetchAllActivities();
    fetchCategories();
  }, []);

  const fetchAllActivities = async () => {
    try {
      const response = await axiosInstance.get('/api/advertiser/activity/viewActivities');
      console.log(response.data);
      setAllActivities(response.data); // Save all activities
      setActivities(response.data); // Initially display all activities
    } catch (error) {
      console.error('Error fetching all activities:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/advertiser/activities/getCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    // Filter activities based on search term
    const filteredActivities = allActivities.filter((activity) =>
      activity.name.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      (categories.find(c => c._id === activity.category)?.CategoryName.toLowerCase() || '').includes(query)
    );

    setActivities(filteredActivities); // Update displayed activities
  };

  return (
    <div className="view-activities">
      <Header />
      <div className="content">
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
                    <Button className="edit-button" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>You don't have activities. Consider adding some :)</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewActivities;

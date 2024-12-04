import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import './ViewMyItineraries.css';
import { Header } from '../../components/TourguideHeader';
import { CalendarIcon, MapPinIcon, TagIcon, Languages, StarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading'; // Import the loading component

const ViewItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [allItineraries, setAllItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllItineraries();
  }, []);

  const fetchAllItineraries = async () => {
    setLoading(true); // Show loading indicator while fetching itineraries
    try {
      const response = await axiosInstance.get('/api/tourGuide/itinerary/getMyItineraries');
      setAllItineraries(response.data.itineraries || []);
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error.response?.data || error.message);
    } finally {
      setLoading(false); // Hide loading indicator once data is fetched
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this itinerary?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete('/api/tourGuide/itinerary/deleteItinerary', { id });
      setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id));
      setAllItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id));
      alert("Itinerary deleted successfully.");
    } catch (error) {
      console.error('Error deleting itinerary:', error.response?.data || error.message);
      alert("Failed to delete itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
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
                      {itinerary.preferenceTags?.map((tagId) => tagId).join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="itinerary-footer">
                    <p className="itinerary-price">${itinerary.price} USD</p>



                    <Button
                      className="edit-button"
                      onClick={() => navigate(`/TourGuide/editMyItinerary/${itinerary._id}`)}// Implement booking functionality if needed
                    >
                      Edit
                    </Button>



                    <Button
                      className="delete-button"
                      onClick={() => handleDelete(itinerary._id)}
                    >
                      Delete
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

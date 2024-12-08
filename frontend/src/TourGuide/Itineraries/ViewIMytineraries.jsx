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
      setLoading(true); // Show loading spinner while processing the delete request
  
      // Send DELETE request to backend
      const response = await axiosInstance.delete(`/api/tourGuide/itinerary/deleteItinerary?id=${id}`);
  
      // Handle success
      if (response.status === 200) {
        alert(response.data.message); // Success message from the backend
        setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id)); // Update state to remove deleted itinerary
        setAllItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id)); // Update state to remove deleted itinerary
      }
    } catch (error) {
      // Handle specific error for booked itineraries
      if (error.response?.status === 400 && error.response.data.message) {
        alert(error.response.data.message); // Display specific message from backend
      } else {
        // Generic error message for any unexpected issue
        alert("An error occurred while trying to delete the itinerary. Please try again.");
      }
      console.error('Error deleting itinerary:', error.response?.data || error.message); // Log error details for debugging
    } finally {
      setLoading(false); // Hide loading spinner after the operation completes
    }
  };
  
 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = allItineraries.filter((itinerary) =>
      itinerary.Name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setItineraries(filtered);
  };
  
  const handletoggle = async (id, currentStatus) => {
    try {
      setLoading(true); // Show loading spinner while processing the request
      const response = await axiosInstance.put(`/api/tourGuide/activate/itinerary?itineraryId=${id}`);
      if (response.status === 200) {
        alert(response.data.message); // Success message from the backend
        setItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary._id === id ? { ...itinerary, isActivated: !currentStatus } : itinerary
          )
        );
        setAllItineraries((prev) =>
          prev.map((itinerary) =>
            itinerary._id === id ? { ...itinerary, isActivated: !currentStatus } : itinerary
          )
        );
      }
    } catch (error) {
      alert("An error occurred while trying to update the itinerary status. Please try again.");
      console.error('Error updating itinerary status:', error.response?.data || error.message);
    } finally {
      setLoading(false); // Hide loading spinner after the operation completes
    }
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
                    <Button
                      className={`toggle-button ${itinerary.isActivated ? 'active' : 'inactive'}`}
                      onClick={() => handletoggle(itinerary._id, itinerary.isActivated)}
                    >
                      {itinerary.isActivated ? 'Active' : 'Deactivate'}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "@/axiosInstance.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin } from "lucide-react";
import "../HotelBooking/GetHotels.css"; // Import custom styles
import { Header } from "@/components/HeaderTourist";
import Loading from "@/components/Loading";

const GetHotels = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [city, setCity] = useState(() => sessionStorage.getItem("city") || ""); // Restore city from sessionStorage
  const [responseData, setResponseData] = useState(() => {
    const data = sessionStorage.getItem("responseData");
    return data ? JSON.parse(data) : null; // Restore responseData if available
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("city", city);
  }, [city]);

  useEffect(() => {
    if (responseData) {
      sessionStorage.setItem("responseData", JSON.stringify(responseData));
    }
  }, [responseData]);

  const handleSearch = async () => {
    if (!city) {
      setError("City is required");
      return;
    }
    setLoading(true);
    setError("");
    setResponseData(null); // Clear previous results
    try {
      const response = await axiosInstance.get(`/api/tourist/getHotels?city=${city}`);
      setResponseData(response.data.hotels.result.data); // Store JSON response
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-hotels">
      <Header />
      <h1>Hotel Finder</h1>
      <div className="search-container">
        <div className="search-bar">
          <Input
            placeholder="Enter City Name"
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button className="search-button" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading && <Loading />}
      {responseData && (
        <div className="hotels-container">
          {responseData.map((hotel) => (
            <div key={hotel.hotelId} className="hotel-card">
              <div className="hotel-image-container">
                <img
                  src=""
                  alt={hotel.name}
                  className="hotel-image"
                />
              </div>
              <div className="hotel-details">
                <div className="hotel-header">
                  <h2 className="hotel-title">{hotel.name}</h2>
                  <div className="hotel-rating">
                    <Star className="icon" />
                    <span>{hotel.rating || "N/A"}</span>
                  </div>
                </div>
                <p className="hotel-description">
                  Location: {hotel.geoCode.latitude}, {hotel.geoCode.longitude}
                </p>
                <div className="hotel-info">
                  <p>
                    <MapPin className="icon" />
                    {hotel.address.countryCode || "N/A"}
                  </p>
                </div>
                <div className="hotel-footer">
                  <Button
                    className="more-info-button"
                    onClick={() =>
                      navigate(`/tourist/getHotelOffers?hotelId=${hotel.hotelId}`)
                    }
                  >
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetHotels;

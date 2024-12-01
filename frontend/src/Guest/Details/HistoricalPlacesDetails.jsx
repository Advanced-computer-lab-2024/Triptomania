import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header"; 
import './HistoricalPlacesDetails.css';

const HistoricalPlaceDetailPage = () => {
  const { id } = useParams();  // Extract the 'id' from the URL
  const [place, setPlace] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/guest/historicalPlaces/getHistoricalPlace/${id}`)
        .then((response) => {
          setPlace(response.data.data);
          setError(null);
        })
        .catch((error) => {
          setError("Failed to load place details.");
        });
    }
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!place) return <p className="loading">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <img
          src={place.Picture || "/placeholder.svg?height=500&width=1920"}
          alt={place.Name}
          className="hero-image"
        />
        <div className="hero-content">
          <h1>{place.Name}</h1>
          <p>{place.Location}</p>
        </div>
      </section>

      {/* Place Details Section */}
      <div className="place-detail-container">
        <h2>Description</h2>
        <p>{place.Description}</p>

        <div className="details-list">
          <p><strong>Opening Hours:</strong> {place.Opening_hours}</p>
          <p><strong>Closing Hours:</strong> {place.Closing_hours}</p>
          <p><strong>Ticket Prices:</strong> ${place.Ticket_prices}</p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalPlaceDetailPage;

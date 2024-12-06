import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance.js"; // Ensure this is configured correctly
import "./BookHotel.css";

const BookHotel = () => {
  const { offerId } = useParams();  // Extract offerId from URL path
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    holderName: "",
  });

  const [error, setError] = useState("");

  // Log offerId to check if it's extracted correctly
  useEffect(() => {
    if (!offerId) {
      setError("Offer ID is missing. Please try again.");
      navigate("/errorPage"); // Redirect to error page or handle accordingly
    }
  }, [offerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!offerId) {
      setError("Offer ID is missing. Please try again.");
      return;
    }

    const bookingData = {
      offerId,
      payment: {
        method: "CREDIT_CARD", // Always set the payment method to "CREDIT_CARD"
        vendorCode: "VI", // Always set the vendor code to "VI"
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        holderName: formData.holderName,
      },
    };

    try {
      // Post the booking data to the backend
      const response = await axiosInstance.post(`/tourist/bookHotel`, bookingData);

      alert(response.data.message || "Booking successful!");
      navigate("/hotelBookings"); // Redirect to bookings page on success
    } catch (err) {
      console.error("Error booking hotel:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="book-hotel">
      <h1>Book Hotel Offer</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="booking-form">
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="expiryDate">Expiry Date (YYYY-MM):</label>
        <input
          type="text"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="holderName">Card Holder Name:</label>
        <input
          type="text"
          id="holderName"
          name="holderName"
          value={formData.holderName}
          onChange={handleChange}
          required
        />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookHotel;

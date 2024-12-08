import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/axiosInstance';
import './FlightBooking.css';
import Loading from '@/components/Loading';
import { Header } from '@/components/HeaderTourist';

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    const documentData = {
      documentType: document.getElementById('documentType').value,
      birthPlace: document.getElementById('birthPlace').value,
      issuanceLocation: document.getElementById('issuanceLocation').value,
      issuanceDate: document.getElementById('issuanceDate').value,
      number: document.getElementById('documentNumber').value,
      expiryDate: document.getElementById('expiryDate').value,
      issuanceCountry: document.getElementById('issuanceCountry').value,
      validityCountry: document.getElementById('validityCountry').value,
      nationality: document.getElementById('nationality').value,
      holder: document.getElementById('holder').checked
    };

    setLoading(true);
    try {
      await axiosInstance.post('/api/tourist/bookFlight', { flight_offer : flight.flight_id, documents: documentData});
      navigate(`/tourist/searchFlights`);
    } catch (error) {
      console.error('Error booking the flight:', error);
      setError('Failed to book the flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-booking">
      <Header />
      <h1>Book Flight</h1>
      {loading && <Loading />}
      {error && <div className="error">{error}</div>}

      <div className="booking-form">
        <label htmlFor="documentType">Document Type:</label>
        <input type="text" id="documentType" className="form-input" />

        <label htmlFor="birthPlace">Birth Place:</label>
        <input type="text" id="birthPlace" className="form-input" />

        <label htmlFor="issuanceLocation">Issuance Location:</label>
        <input type="text" id="issuanceLocation" className="form-input" />

        <label htmlFor="issuanceDate">Issuance Date:</label>
        <input type="date" id="issuanceDate" className="form-input" />

        <label htmlFor="documentNumber">Document Number:</label>
        <input type="text" id="documentNumber" className="form-input" />

        <label htmlFor="expiryDate">Expiry Date:</label>
        <input type="date" id="expiryDate" className="form-input" />

        <label htmlFor="issuanceCountry">Issuance Country:</label>
        <input type="text" id="issuanceCountry" className="form-input" />

        <label htmlFor="validityCountry">Validity Country:</label>
        <input type="text" id="validityCountry" className="form-input" />

        <label htmlFor="nationality">Nationality:</label>
        <input type="text" id="nationality" className="form-input" />

        <label htmlFor="holder">Holder:</label>
        <input type="checkbox" id="holder" className="form-input" />

        <button className="book-flight-button" onClick={handleBooking}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default FlightBooking;

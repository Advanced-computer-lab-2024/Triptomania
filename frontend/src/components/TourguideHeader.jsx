import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust path as needed
import './Header.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { Bell, ShoppingCart, User } from 'lucide-react'; // Import icons for notifications, cart, and profile
import { Link } from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();  // Initialize navigate function

    const handleSignInClick = () => {
      navigate("/login");  // Navigate to the Login page on button click
    };

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/tourGuide/home" className="brand">
              TripTomania
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link to="/tourGuide/home" className="header-link">Home</Link>
            <Link to="/tourGuide/MyItineraries" className="header-link">My Itineraries</Link>
            <Link to="/tourGuide/addItinerary" className="header-link">Add itinerary</Link>
            <Link to="/tourGuide/generateSalesReport" className="header-link">Sales Report</Link>
            <Link to="/tourGuide/generateTouristReport" className="header-link">Tourist Report</Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link to="/tourGuide/notifications" className="icon-link">
              <Bell className="h-6 w-6 text-black hover:text-primary" />
            </Link>
            <Link to="/tourGuide/tourGuide-account" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

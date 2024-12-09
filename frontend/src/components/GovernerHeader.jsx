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
            <Link to="/tourismGovernor/home" className="brand">
              TripTomania
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link to="/tourismGovernor/home" className="header-link">Home</Link>
            <Link to="/myHistoricalPlaces" className="header-link">My Historical Places</Link>
            <Link to="/tourismGovernor/historicalPlace/addHistoricalPlaces" className="header-link">Add historical place</Link>
            <Link to="/tourismGovernor/tags/viewTag" className="header-link">Tags</Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            
          <Link to="/tourismGovernor/governor-account" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </Link>
           
          </div>
        </div>
      </div>
    </header>
  );
}
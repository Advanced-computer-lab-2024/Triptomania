import React from 'react';
import './Header.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { Bell, Heart, ShoppingCart, User } from 'lucide-react'; // Import icons for notifications, cart, and profile
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
            <Link to="/tourist/home" className="brand">
              TripTomania
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link to="/tourist/home" className="header-link">Home</Link>
            <Link to="/tourist/Activities" className="header-link">Activities</Link>
            <Link to="/itineraries" className="header-link">Itineraries</Link>
            <Link to="/tourist/HistoricalPlaces" className="header-link">Historical Places</Link>
<<<<<<< HEAD
            <Link to="/tourist/view-mycomplaints" className="header-link">My Complaints</Link>
=======
            <Link to="/tourist/view-mycomplaints" className="header-link">Historical Places</Link>
>>>>>>> ed14b72 (oo)
            <Link to="/tourist/products/viewproducts" className="header-link">Products</Link>
            <Link to="/tourist/searchFlights" className="header-link">Flights</Link>
            <Link to="/tourist/hotelBooking/getHotels" className="header-link">Hotels</Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link to="/notifications" className="icon-link">
              <Bell className="h-6 w-6 text-black hover:text-primary" />
            </Link> 
            <Link to="/Tourist/WishList" className="icon-link ml-6"><Heart className="h-6 w-6 text-black hover:text-primary" />
            </Link>
            <Link to="/Tourist/Cart" className="icon-link ml-6"><ShoppingCart className="h-6 w-6 text-black hover:text-primary" />
            </Link>
            <Link to="/tourist/account" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust path as needed
import './Header.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { Bell, ShoppingCart, User } from 'lucide-react'; // Import icons for notifications, cart, and profile


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
            <a href="/" className="brand">
              TripTomania
            </a>
          </div>
          <nav className="hidden md:flex space-x-10">
            <a href="/AdvertiserHomePage" className="nav-link">Home</a>
            <a href="/Advertiser/AllActivities" className="nav-link">All Activities</a>
            <a href="/Advertiser/MyActivities" className="nav-link">My Activities</a>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <a href="/notifications" className="icon-link">
              <Bell className="h-6 w-6 text-black hover:text-primary" />
            </a>
            <a href="/cart" className="icon-link ml-6">
              <ShoppingCart className="h-6 w-6 text-black hover:text-primary" />
            </a>
            <a href="/profile" className="icon-link ml-6">
              <User className="h-6 w-6 text-black hover:text-primary" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

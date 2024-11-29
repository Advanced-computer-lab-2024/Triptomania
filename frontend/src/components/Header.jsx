// src/components/Header.jsx

import React from 'react';
import { Button } from "@/components/ui/button"; // Adjust path as needed
import './Header.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';  // Import useNavigate

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
            <a href="#" className="brand">
              TripTomania
            </a>
          </div>
          <nav className="hidden md:flex space-x-10">
            <a href="#" className="nav-link">Activities</a>
            <a href="#" className="nav-link">Historical places</a>
            <a href="#" className="nav-link">Itineraries</a>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <Button variant="ghost" className="signin-btn" onClick={handleSignInClick}>
          Sign in
            </Button>
            <Button className="signup-btn">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Import App component
// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
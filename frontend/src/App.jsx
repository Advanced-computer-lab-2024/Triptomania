import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
import ViewActivities from './Tourist/Activities/ViewActivities';
import TouristHomeScreen from './Tourist/TouristHomeScreen';

import ViewItineraryDetails from './Guest/Details/ViewItineraryDetails';
import ActivityDetails from './Guest/Details/ActivityDetails';
import HistoricalPlacesDetails from './Guest/Details/HistoricalPlacesDetails';

import AddActivity from './Advertiser/Activities/AddActivity';
import ViewProducts from './Admin/Products/ViewProducts';
import RequestOtpPage from './Pages/auth/RequestOtp';
import VerifyOtpPage from './Pages/auth/VerifyOtp';
import NewPasswordPage from './Pages/auth/NewPassword';
import GetHotels from './Tourist/HotelBooking/GetHotels'

const App = () => {
  return (
    <Routes>
      {/*<Route path="/" element={<LandingPage />} />*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/activities" element={<ViewActivities />} />
      <Route path="/" element={<TouristHomeScreen />} />

      <Route path="/itinerary/:id" element={<ViewItineraryDetails />} />
      <Route path="/activity/:id" element={<ActivityDetails />} />
      <Route path="/historicalplaces/:id" element={<HistoricalPlacesDetails />} />

      <Route path="/advertiser/addActivity" element={<AddActivity />} />
      <Route path="/admin/products/viewproducts" element = {<ViewProducts/>} />
      <Route path="/auth/requestOtp" element = {<RequestOtpPage/>} />
      <Route path="/auth/verifyOtp" element = {<VerifyOtpPage/>} />
      <Route path="/auth/newPassword" element = {<NewPasswordPage/>} />
      <Route path="/tourist/hotelBooking/getHotels" element = {<GetHotels/>} />

      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>
  );
};

export default App;

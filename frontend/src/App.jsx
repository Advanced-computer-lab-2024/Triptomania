import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import SignUp from './Pages/SignUp';
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
import TouristHomeScreen from './Tourist/TouristHomeScreen';
import ViewActivities from './Guest/Activities/ViewActivities';
import ViewItineraryDetails from './Guest/Details/ViewItineraryDetails';
import ActivityDetails from './Guest/Details/ActivityDetails';
import HistoricalPlacesDetails from './Guest/Details/HistoricalPlacesDetails';
import AddActivity from './Advertiser/Activities/AddActivity';
import ViewProducts from './Admin/Products/ViewProducts';
import RequestOtpPage from './Pages/auth/RequestOtp';
import VerifyOtpPage from './Pages/auth/VerifyOtp';
import NewPasswordPage from './Pages/auth/NewPassword';
import GetHotels from './Tourist/HotelBooking/GetHotels'
import AddProduct from './Seller/Product/AddProduct';
import AddHistoricalPlace from './TourismGovernor/HistoricalPlaces/AddHistoricalPlaces ';
import AddItinerary from './TourGuide/Itineraries/AddItineraries';
import AdvertiserSignUp from './Pages/AdvertiserSignUp';
import SellerSignUp from './Pages/SellerSignUp';
import FileComplaint from './Tourist/Complaints/FileComplaint'
import ViewProductsTourist from './Tourist/Products/ViewProducts'
import GetHotelOffers from './Tourist/GetHotelOffers/GetHotelOffers';
import SellerViewProducts from './Seller/SellerViewProducts.jsx';
import SellerViewMyProducts from './Seller/SellerViewMyProducts.jsx';
import SellerHomePage from './Seller/SellerHomePage.jsx';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignUp/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/TouristHomeScreen" element={<TouristHomeScreen />} />
      <Route path="/tourist/home" element={<TouristHomeScreen />} />
      <Route path="/guest/viewActivities" element={<ViewActivities />} />
      <Route path="/itinerary/:id" element={<ViewItineraryDetails />} />
      <Route path="/activity/:id" element={<ActivityDetails />} />
      <Route path="/historicalplaces/:id" element={<HistoricalPlacesDetails />} />
      <Route path="/advertiser/addActivity" element={<AddActivity />} />
      <Route path="/seller/addProduct" element={<AddProduct />} />
      <Route path="/tourismGovernor/addHistoricalPlaces" element={<AddHistoricalPlace />} />
      <Route path="/tourGuide/addItinerary" element={<AddItinerary />} />
      <Route path="/admin/products/viewproducts" element = {<ViewProducts/>} />
      <Route path="/auth/requestOtp" element = {<RequestOtpPage/>} />
      <Route path="/auth/verifyOtp" element = {<VerifyOtpPage/>} />
      <Route path="/auth/newPassword" element = {<NewPasswordPage/>} />
      <Route path="/tourist/hotelBooking/getHotels" element = {<GetHotels/>} />
      <Route path="/advertisersign-up" element={<AdvertiserSignUp />} />
      <Route path="/sellersign-up" element={<SellerSignUp />} />
      <Route path="/Seller/SellerHomePage" element={<SellerHomePage />} />
      <Route path="/tourist/fileComplaint" element={<FileComplaint />} />
      <Route path="/tourist/products/viewproducts" element = {<ViewProductsTourist/>} />
      <Route path="/tourist/getHotelOffers" element={<GetHotelOffers />} />
      <Route path="/Seller/ViewProducts" element={<SellerViewProducts/>} />
      <Route path="/Seller/ViewMyProducts" element={<SellerViewMyProducts/>} />
    </Routes>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import SignUp from './Pages/SignUp';
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
import TouristHomeScreen from './Tourist/TouristHomeScreen';
import ViewActivities from './Guest/Activities/ViewActivities';
import ViewItineraries from './Guest/Itineraries/ViewItineraries';
import ViewItineraryDetails from './Guest/Details/ViewItineraryDetails';
import ActivityDetails from './Guest/Details/ActivityDetails';
import HistoricalPlacesDetails from './Guest/Details/HistoricalPlacesDetails';
import AddActivity from './Advertiser/Activities/AddActivity';
import ViewProducts from './Admin/Products/ViewProducts';
import EditMyProduct from './Seller/Product/editMyProducts';
import RequestOtpPage from './Pages/auth/RequestOtp';
import VerifyOtpPage from './Pages/auth/VerifyOtp';
import NewPasswordPage from './Pages/auth/NewPassword';
import GetHotels from './Tourist/HotelBooking/GetHotels'
import AddProduct from './Seller/Product/AddProduct';
import AddHistoricalPlace from './TourismGovernor/HistoricalPlaces/AddHistoricalPlaces';
import AddItinerary from './TourGuide/Itineraries/AddItineraries';
import AdvertiserSignUp from './Pages/AdvertiserSignUp';
import SellerSignUp from './Pages/SellerSignUp';
import TouristSignUp from './Pages/TouristSignUp';
import TourGuideSignUp from './Pages/TourGuideSignUp';
import FileComplaint from './Tourist/Complaints/FileComplaint'
import ViewProductsTourist from './Tourist/Products/ViewProducts';
import GetHotelOffers from './Tourist/HotelBooking/GetHotelOffers';
import SellerViewProducts from './Seller/Product/ViewProducts';
import SellerViewMyProducts from './Seller/Product/ViewMyProducts';
import SellerHomePage from './Seller/SellerHomePage.jsx';
import BookHotel from './Tourist/HotelBooking/BookHotel';
import ViewHistoricalPlaces from './Guest/HistoicalPlaces/viewHistoricalPlaces';
import AdminHomePage from './Admin/AdminHomePage';
import TourGuideAllItirenaries from './TourGuide/TourGuideAllItirenaries.jsx';
import TourGuideMyItirenaries from './TourGuide/TourGuideMyItirenaries.jsx';
import SearchFlights from './Tourist/FlightBooking/searchFlights';
import FlightInfo from './Tourist/FlightBooking/FlightInfo';
import DocumentsViewer from './Admin/Documentsviewer/DocumentsViewer.jsx';
import GeneratePdfs from './Admin/GeneratePdfs/GeneratePdfs.jsx';
import Complaints from './Pages/Complaints';
import Complaint from './Pages/Complaint';
import TourismGovernorHomePage from './TourismGovernor/TourismGovernorHomePage';
import UploadHistoricalPicture from './TourismGovernor/HistoricalPlaces/UploadHistoricalPicture';
import SalesReportViewer from './Admin/SalesReportViewer/SalesReportViewer';
import UploadProductPicture from './Seller/Product/UploadProductPicture';
import TouristAccountManagement from './Tourist/Account/pages/AccountManagement';
import NotFoundPage from './Pages/NotFoundPage';
import AdvertiserHomePage from './Advertiser/AdvertiserHomePage';
import ViewActivitiesAdvertiser from './Advertiser/Activities/ViewMyActivities';
import TourGuideHomePage from './TourGuide/TourGuideHomePage';
import ViewMyItinerariesTourGuide from './TourGuide/Itineraries/ViewIMytineraries';
import EditMyItinerary from './TourGuide/Itineraries/editMyItinerary';
import ProductDetails from './Tourist/Products/ProductDetails';
import TouristCart from './Tourist/TouristCart/TouristCart';
import DeleteUsers from './Admin/DeleteUsers/DeleteUsers';
import ActivityCategories from './Admin/ActivityCategories/ActivityCategories';
import PreferenceTags from './Admin/PreferenceTags/PreferenceTags';
import Promocode from './Admin/Promocode/Promocode';
import AccountCreation from './Admin/AccountCreation/AccountCreation';
import Checkout from './Tourist/Checkout/Checkout';
import Thankyoupage from './Tourist/Checkout/Thankyoupage/Thankyoupage';
import Activities from './Tourist/Activities/Activities';
import HistoricalPlacesView from './Tourist/HistoricalPlacesView/HistoricalPlacesView';
import HistoricalPlacesVieww from './TourismGovernor/HistoricalPlaces/HistoricalPlacesVieww';
import HistoricalPlacesViewww from './TourismGovernor/HistoricalPlaces/HistoricalPlacesViewww';
import UploadDocGuide from './TourGuide/SignUp/UploadDocuments';
import ViewComplaints from './Tourist/Complaints/viewMyComplaints';
const App = () => {
  return (    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignUp/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/tourist/home" element={<TouristHomeScreen />} />
      <Route path="/guest/Activities" element={<ViewActivities />} />
      <Route path="/guest/Itineraries" element={<ViewItineraries />} />
      <Route path="/itinerary/:id" element={<ViewItineraryDetails />} />
      <Route path="/activity/:id" element={<ActivityDetails />} />
      <Route path="/historicalplaces/:id" element={<HistoricalPlacesDetails />} />
      <Route path="/advertiser/addActivity" element={<AddActivity />} />
      <Route path="/seller/addProduct" element={<AddProduct />} />
      <Route path="/tourismGovernor/addHistoricalPlaces" element={<AddHistoricalPlace />} />
      <Route path="/tourGuide/addItinerary" element={<AddItinerary />} />
      <Route path="/admin/products/viewproducts" element = {<ViewProducts/>} />
      <Route path="/Seller/editMyProducts/:productId" element={<EditMyProduct />} />
      <Route path="/auth/requestOtp" element = {<RequestOtpPage/>} />
      <Route path="/auth/verifyOtp" element = {<VerifyOtpPage/>} />
      <Route path="/auth/newPassword" element = {<NewPasswordPage/>} />
      <Route path="/tourist/hotelBooking/getHotels" element = {<GetHotels/>} />
      <Route path="/advertisersign-up" element={<AdvertiserSignUp />} />
      <Route path="/sellersign-up" element={<SellerSignUp />} />
      <Route path="/touristsign-up" element={<TouristSignUp />} />
      <Route path="/tourguidesign-up" element={<TourGuideSignUp />} />
      <Route path="/seller/home" element={<SellerHomePage />} />
      <Route path="/tourist/fileComplaint" element={<FileComplaint />} />
      <Route path="/tourist/products/viewproducts" element = {<ViewProductsTourist/>} />
      <Route path="/tourist/getHotelOffers" element={<GetHotelOffers />} />
      <Route path="/Seller/ViewProducts" element={<SellerViewProducts/>} />
      <Route path="/Seller/ViewMyProducts" element={<SellerViewMyProducts/>} />
      <Route path="/tourist/bookHotel/:offerId" element={<BookHotel />} />
      <Route path="/admin/home" element={<AdminHomePage />} />
      <Route path="/tourGuide/AllItirnaries" element={<TourGuideAllItirenaries />} />
      <Route path="/tourGuide/MyItirnaries" element={<TourGuideMyItirenaries />} />
      <Route path="/tourist/searchFlights" element={<SearchFlights />} />
      <Route path="/tourist/getFlightOffers/:flightOfferId" element={<FlightInfo />} />
      <Route path="/admin/view/documents" element={<DocumentsViewer />} />
      <Route path="/admin/generatePdfs" element={<GeneratePdfs />} />

      <Route path="/admin/complaints" element={<Complaints />} />
      <Route path="/admin/complaint" element={<Complaint />} />
      <Route path="/guest/HistoricalPlaces" element={<ViewHistoricalPlaces />} />
      <Route path="/tourismGovernor/home" element={<TourismGovernorHomePage/>} />
      <Route path="/tourismGovernor/historicalPlace/addHistoricalPlaces" element={<AddHistoricalPlace />} />
      <Route path="/seller/addProduct" element={<AddProduct />} />
      <Route path="tourismGoverner/HistoricalPlace/uploadPhoto" element={<UploadHistoricalPicture />} />
      <Route path="/sales-report" element={<SalesReportViewer />} />
      <Route path="/seller/product/uploadPicture" element={<UploadProductPicture />} />
      <Route path="/tourist/account" element={<TouristAccountManagement />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/advertiser/home" element={<AdvertiserHomePage />} />
      <Route path="/advertiser/Activities" element={<ViewActivitiesAdvertiser />} />
      <Route path="/tourGuide/home" element={<TourGuideHomePage/>} />
      <Route path="/tourGuide/MyItineraries" element={<ViewMyItinerariesTourGuide/>} />
      <Route path="/tourGuide/editMyItinerary/:id" element={<EditMyItinerary />} />
      <Route path="/tourist/product/:id" element={<ProductDetails />} />
      <Route path="/tourist/cart" element={<TouristCart />} />
      <Route path="/admin/deleteUsers" element={<DeleteUsers />} />
      <Route path="/admin/activityCategories" element={<ActivityCategories />} />
      <Route path="/admin/preferenceTags" element={<PreferenceTags />} />
      <Route path="/admin/promoCode" element={<Promocode />} />
      <Route path="/admin/accountCreation" element={<AccountCreation />} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/thankyou" element={<Thankyoupage />} />
      <Route path="/tourist/Activities" element={<Activities />} />
      <Route path="/tourist/HistoricalPlaces" element={<HistoricalPlacesView />} />
   
      <Route path="/tourismgoverner/HistoricalPlaces" element={<HistoricalPlacesVieww />} />
      <Route path="/myHistoricalPlaces" element={<HistoricalPlacesViewww/>} />
      <Route path="/tourGuide/uploadDocument" element={<UploadDocGuide/>} />
      <Route path="/tourist/view-mycomplaints" element={<ViewComplaints/>}/>
    </Routes>
  );
};

export default App;

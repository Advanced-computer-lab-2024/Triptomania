import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import SignUp from './Pages/SignUp';
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
import TouristHomeScreen from './Tourist/TouristHomeScreen';
import ViewActivities from './Guest/Activities/ViewActivities';
import ViewActivitiesTourist from './Tourist/Activities/ViewActivitiesTourist';
import ViewItinerariesTourist from './Tourist/Itineraries/ViewItinerariesTourist';

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
import EditHistoricalPlace from './TourismGovernor/HistoricalPlaces/EditHistoricalPlace';
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
import Complaints from './Admin/Complaints/Complaints';
import Complaint from './Admin/Complaints/Complaint';
import TourismGovernorHomePage from './TourismGovernor/TourismGovernorHomePage';
import UploadHistoricalPicture from './TourismGovernor/HistoricalPlaces/UploadHistoricalPicture';
import SalesReportViewer from './Admin/SalesReportViewer/SalesReportViewer';
import UploadProductPicture from './Seller/Product/UploadProductPicture';
import TouristAccountManagement from './Tourist/Account/pages/AccountManagement';
import NotFoundPage from './Pages/NotFoundPage';
import AdvertiserHomePage from './Advertiser/AdvertiserHomePage';
import ViewActivitiesAdvertiser from './Advertiser/Activities/ViewMyActivities';
import TourGuideHomePage from './TourGuide/TourGuideHomePage';
import ViewMyItinerariesTourGuide from './TourGuide/Itineraries/ViewMytineraries';
import EditMyItinerary from './TourGuide/Itineraries/editMyItinerary';
import EditActivity from './Advertiser/Activities/EditActivity';

import ProductDetails from './Tourist/Products/ProductDetails';
import TouristCart from './Tourist/TouristCart/TouristCart';
import DeleteUsers from './Admin/DeleteUsers/DeleteUsers';
import ActivityCategories from './Admin/ActivityCategories/ActivityCategories';
import PreferenceTags from './Admin/PreferenceTags/PreferenceTags';
import Promocode from './Admin/Promocode/Promocode';
import AccountCreation from './Admin/AccountCreation/AccountCreation';
import Checkout from './Tourist/Checkout/Checkout';
import Thankyoupage from './Tourist/Checkout/Thankyoupage/Thankyoupage';
import HistoricalPlacesView from './Tourist/HistoricalPlacesView/HistoricalPlacesView';
import HistoricalPlacesVieww from './TourismGovernor/HistoricalPlaces/HistoricalPlacesVieww';
import HistoricalPlacesViewww from './TourismGovernor/HistoricalPlaces/HistoricalPlacesViewww';
import UploadDocGuide from './TourGuide/SignUp/uploadDocuments';
import ViewComplaints from './Tourist/Complaints/viewMyComplaints';
import FlightBooking from './Tourist/FlightBooking/FlightBooking';
import ViewTag from './TourismGovernor/Tags/ViewTag';
import WishList from './Tourist/WishList/WishList';
import ViewActivitiesAdmin from './Admin/ViewActivities/ViewActivities';
import ViewItinerariesAdmin from './Admin/ViewItineraries/ViewItineraries';
import EditProduct from './Admin/Products/editProducts';
import SellerAccount from './Seller/Account/pages/AccountManagement';
import TourGuideAccount from './TourGuide/Account/pages/AccountManagement';
import AdvertiserAccount from './Advertiser/Account/pages/AccountManagement';
import GovernorAccount from './TourismGovernor/Account/pages/AccountManagement';
import AdminAccount from './Admin/Account/pages/AccountManagement';
import UploadSellerDocument from './Pages/UploadSellerDocument';
import UploadSellerPicture from './Pages/UploadSellerPicture';
import UploadPictureGuide from './TourGuide/SignUp/UploadPictureGuide';
import AdvertiserUploadDocument from './Advertiser/AdvertiserUploadDocument';
import AdvertiserUploadPicture from './Advertiser/AdvertiserUploadPicture';
import EventCheckout from './Tourist/Account/pages/EventCheckout';
import AcceptTerms from './Pages/TermsAndConditions';

import ChoosePreferenceTag from './Pages/PreferencesTags';
import Review from './Tourist/Account/components/Review';
import TouristNotifications from './Tourist/ViewNotifications'
import TourGuideNotifications from './TourGuide/ViewNotifications'
import SellerNotifications from './Seller/ViewNotifications'
import AdvertiserNotifications from './Advertiser/ViewNotifications'
import AdminNotifications from './Admin/ViewNotifications'
import TourGuideRevenueReport from './TourGuide/GenerateReport/ReportTourGuide';
import TourGuideTouristReport from './TourGuide/TouristCountReport/TouristCountTourGuide';
import AdvertiserRevenueReport from './Advertiser/ReportAdvertiser/ReportAdvertiser';
import AdvertiserTouristReport from './Advertiser/TouristCountReport/TouristCountAdvertiser';
import SellerRevenueReport from './Seller/GenerateReport/GenerateReport';
import TouristPreferences from './Pages/TouristPreferences';

const App = () => {
  return (    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignUp/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/tourist/home" element={<TouristHomeScreen />} />
      <Route path="/guest/Activities" element={<ViewActivities />} />
      <Route path="/tourist/viewactivities-tourist" element={<ViewActivitiesTourist />} />
      <Route path="/tourist/viewitineraries-tourist" element={<ViewItinerariesTourist />} />
      <Route path="/tourist/preferences" element={<TouristPreferences />} />
      <Route path="/guest/Itineraries" element={<ViewItineraries />} />
      <Route path="/itinerary/:id" element={<ViewItineraryDetails />} />
      <Route path="/activity/:id" element={<ActivityDetails />} />
      <Route path="/historicalplaces/:id" element={<HistoricalPlacesDetails />} />
      <Route path="/advertiser/addActivity" element={<AddActivity />} />
      <Route path="/seller/addProduct" element={<AddProduct />} />
      <Route path="/tourismGovernor/addHistoricalPlaces" element={<AddHistoricalPlace />} />
      <Route path="/tourismGovernor/editHistoricalPlace/:id" element={<EditHistoricalPlace />} />
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
      <Route path="/advertiser/editactivity/:id" element={<EditActivity/>} />

      <Route path="/tourist/product/:id" element={<ProductDetails />} />
      <Route path="/tourist/cart" element={<TouristCart />} />
      <Route path="/admin/deleteUsers" element={<DeleteUsers />} />
      <Route path="/admin/activityCategories" element={<ActivityCategories />} />
      <Route path="/admin/preferenceTags" element={<PreferenceTags />} />
      <Route path="/admin/promoCode" element={<Promocode />} />
      <Route path="/admin/accountCreation" element={<AccountCreation />} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/thankyou" element={<Thankyoupage />} />
      <Route path="/tourist/HistoricalPlaces" element={<HistoricalPlacesView />} />
   
      <Route path="/tourismgoverner/HistoricalPlaces" element={<HistoricalPlacesVieww />} />
      <Route path="/myHistoricalPlaces" element={<HistoricalPlacesViewww/>} />
      <Route path="/tourGuide/uploadDocument" element={<UploadDocGuide/>} />
      <Route path="/tourist/view-mycomplaints" element={<ViewComplaints/>}/>
      <Route path="/tourist/flightBooking/:flight_id" element={<FlightBooking />} />
      <Route path="/admin/editProducts/:productId" element={<EditProduct />} />
      <Route path="/seller/seller-account" element={<SellerAccount/>} />
      <Route path="/tourismGovernor/governor-account" element={<GovernorAccount/>} />
      <Route path="/admin/admin-account" element={<AdminAccount/>} />
      <Route path="/tourGuide/tourGuide-account" element={<TourGuideAccount/>} /> 
      <Route path="/advertiser/advertiser-account" element={<AdvertiserAccount/>} /> 
      <Route path="/seller/uploadDocument" element={<UploadSellerDocument />} />
      <Route path="/seller/uploadPicture" element={<UploadSellerPicture />} />
      <Route path="/seller/generateReport" element={<SellerRevenueReport />} />
      <Route path="/tourGuide/uploadPicture" element={<UploadPictureGuide />} />

      <Route path="/tourismGovernor/tags/viewTag" element={<ViewTag />} />
      <Route path="/admin/ViewActivitiesAdmin" element={<ViewActivitiesAdmin />} />
      <Route path="/tourist/wishlist" element={<WishList />} />
      <Route path="Admin/ViewItinerariesAdmin" element={<ViewItinerariesAdmin />} />
      <Route path="/advertiser/uploadDocument" element={<AdvertiserUploadDocument />} />
      <Route path="/advertiser/uploadPicture" element={<AdvertiserUploadPicture />} />
      <Route path="/tourist/viewactivities-tourist" element={<ViewActivitiesTourist />} />
      <Route path="/tourist/viewitineraries-tourist" element={<ViewItinerariesTourist/>}/>
      <Route path="/tourist/eventCheckout" element={<EventCheckout />} />
      <Route path="/acceptTerms" element={<AcceptTerms />} />
      <Route path="/tourist/choose-prefrence" element={<ChoosePreferenceTag/>}/>
      <Route path="/give-review" element={<Review />} />
      <Route path="/tourist/notifications" element={<TouristNotifications />} />
      <Route path="/tourGuide/notifications" element={<TourGuideNotifications />} />
      <Route path="/advertiser/notifications" element={<AdvertiserNotifications />} />
      <Route path="/seller/notifications" element={<SellerNotifications />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/tourGuide/generateSalesReport" element={<TourGuideRevenueReport />} />
      <Route path="/tourGuide/generateTouristReport" element={<TourGuideTouristReport />} />
      <Route path="/advertiser/generateSalesReport" element={<AdvertiserRevenueReport />} />
      <Route path="/advertiser/generateTouristReport" element={<AdvertiserTouristReport />} />

    </Routes>
  );
};

export default App;

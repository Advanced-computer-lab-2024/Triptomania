import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
import ViewActivities from './Tourist/Activities/ViewActivities';
import AddActivity from './Advertiser/Activities/AddActivity';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/activities" element={<ViewActivities />} />
      <Route path="/advertiser/activities" element={<AddActivity />} />
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>
  );
};

export default App;

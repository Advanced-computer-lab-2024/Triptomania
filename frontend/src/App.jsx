import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './Pages/LoginPage'; // LoginPage component
import ResetPassword from './components/ResetPassword'; // ResetPassword component
import LandingPage from './Pages/LandingPage';
// import SignUp from './components/SignUp'; // SignUp component
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>
  );
};

export default App;

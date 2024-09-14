import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginForAll";
import SignUpDonor from "./pages/SignUp/DonorSignUp";
import HospitalSignUp from "./pages/HospitalSignUp/HospitalSignUp";
import DonorDashboard from "./pages/DonorDashboard/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard/HospitalDashboard";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import EmailConfirmation from "./pages/EmailConfirmation/EmailConfirmation"; // Import the new component
import PrivateRoute from "./PrivateRoute";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/LoginPage", "/SignUpDonor", "/HospitalSignUp", "/ForgetPassword", "/reset-password", "/verify-email"];

  return (
    <div className="app">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUpDonor" element={<SignUpDonor />} />
        <Route path="/HospitalSignUp" element={<HospitalSignUp />} />
        <Route path="/DonorDashboard/*" element={<PrivateRoute><DonorDashboard /></PrivateRoute>} />
        <Route path="/HospitalDashboard/*" element={<PrivateRoute><HospitalDashboard /></PrivateRoute>} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailConfirmation />} /> {/* Add the new route */}
      </Routes>
    </div>
  );
};

export default App;

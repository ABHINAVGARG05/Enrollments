import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./dashboard/Dashboard";
import ForgotPassword from "./sections/ForgotPasswordStep1";
import Landing from "./sections/Landing";
import ResetPassword from "./sections/ResetPassword";
import Signup from "./sections/Signup";
import VerifyOTP from "./sections/VerifyOTP";
import BaseWrapper from "./wrappers/BaseWrapper";
import MainWrapper from "./wrappers/MainWrapper";
import About from "./sections/About";
import FAQs from "./sections/FAQs";
import ChangeProfile from "./sections/ChangeProfile";
import Meeting from "./sections/Meeting"

function App() {
  return (
    <BaseWrapper>
      <link
        href="https://unpkg.com/nes.css@2.2.1/css/nes.min.css"
        rel="stylesheet"
      />
      <MainWrapper>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verifyotp" element={<VerifyOTP />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQs />} />
            <Route path="/profile" element={<ChangeProfile />} />
            <Route path="/meeting" element={<Meeting />} />
          </Routes>
        </Router>
      </MainWrapper>
    </BaseWrapper>
  );
}

export default App;

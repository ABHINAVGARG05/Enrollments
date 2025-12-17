import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
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
            {/* Public pages: Landing, Signup, Auth flows */}
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/resetpassword" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/forgotpassword" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

            {/* Protected pages - require auth */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ChangeProfile /></ProtectedRoute>} />
            <Route path="/meeting" element={<ProtectedRoute><Meeting /></ProtectedRoute>} />

            {/* Misc */}
            <Route path="/" element={<Landing />} />
            <Route path="/verifyotp" element={<VerifyOTP />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQs />} />

            {/* Catch-all: show landing for unauthenticated, redirect logged-in users to dashboard via PublicRoute */}
            <Route path="*" element={<PublicRoute><Landing /></PublicRoute>} />
          </Routes>
        </Router>
      </MainWrapper>
    </BaseWrapper>
  );
}

export default App;

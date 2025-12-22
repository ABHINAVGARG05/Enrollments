import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BaseWrapper from "./wrappers/BaseWrapper";
import MainWrapper from "./wrappers/MainWrapper";

import {
  LazyDashboard,
  LazySignup,
  LazyLanding,
  LazyAbout,
  LazyFAQs,
  LazyChangeProfile,
  LazyMeeting,
  LazyForgotPassword,
  LazyResetPassword,
  LazyVerifyOTP,
  LoadingFallback,
} from "./components/LazyComponents";

import { KonamiEffect, KonamiProgressIndicator, useKonamiCode } from "./hooks/useKonamiCode";
import { useCursorTrail, useClickEffect } from "./hooks/useCursorTrail";
import { ScreenShakeProvider } from "./hooks/useScreenShake";
import { initConsoleEasterEgg } from "./utils/consoleEasterEgg";

function App() {
  const { isActivated: konamiActivated, setIsActivated: setKonamiActivated, progress: konamiProgress } = useKonamiCode();
  
  // Subtle cursor trail and click effects
  useCursorTrail(true);
  useClickEffect(true);

  useEffect(() => {
    initConsoleEasterEgg();
  }, []);

  return (
    <ScreenShakeProvider>
      <BaseWrapper>
        <MainWrapper>
          {/* Progress indicator shows when typing Konami code */}
          <KonamiProgressIndicator progress={konamiProgress} />
          
          <KonamiEffect 
            isActive={konamiActivated} 
            onClose={() => setKonamiActivated(false)} 
          />

          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/signup" element={<PublicRoute><LazySignup /></PublicRoute>} />
                <Route path="/resetpassword" element={<PublicRoute><LazyResetPassword /></PublicRoute>} />
                <Route path="/forgotpassword" element={<PublicRoute><LazyForgotPassword /></PublicRoute>} />

                <Route path="/dashboard" element={<ProtectedRoute><LazyDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><LazyChangeProfile /></ProtectedRoute>} />
                <Route path="/meeting" element={<ProtectedRoute><LazyMeeting /></ProtectedRoute>} />

                <Route path="/" element={<LazyLanding />} />
                <Route path="/verifyotp/:id" element={<LazyVerifyOTP />} />
                <Route path="/about" element={<LazyAbout />} />
                <Route path="/faq" element={<LazyFAQs />} />

                <Route path="*" element={<PublicRoute><LazyLanding /></PublicRoute>} />
              </Routes>
            </Suspense>
          </Router>
        </MainWrapper>
      </BaseWrapper>
    </ScreenShakeProvider>
  );
}

export default App;

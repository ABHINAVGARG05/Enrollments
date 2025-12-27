import { lazy, Suspense } from "react";

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-black">
    <div className="text-center">
      <div 
        className="text-prime text-sm animate-pulse"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Loading...
      </div>
      <div className="mt-4 flex justify-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-prime rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const LazyDashboard = lazy(() => import("../dashboard/Dashboard"));
export const LazySignup = lazy(() => import("../sections/Signup"));
export const LazyLanding = lazy(() => import("../sections/Landing"));
export const LazyAbout = lazy(() => import("../sections/About"));
export const LazyFAQs = lazy(() => import("../sections/FAQs"));
export const LazyChangeProfile = lazy(() => import("../sections/ChangeProfile"));
export const LazyMeeting = lazy(() => import("../sections/Meeting"));
export const LazyForgotPassword = lazy(() => import("../sections/ForgotPasswordStep1"));
export const LazyResetPassword = lazy(() => import("../sections/ResetPassword"));
export const LazyVerifyOTP = lazy(() => import("../sections/VerifyOTP"));

export { LoadingFallback, Suspense };

import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactElement;
}

// PublicRoute prevents logged-in users from visiting auth pages (login/signup)
const PublicRoute: React.FC<Props> = ({ children }) => {
  const token = Cookies.get("jwtToken");
  if (token) {
    // Already authenticated -> redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;

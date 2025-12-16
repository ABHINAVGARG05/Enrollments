import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Props {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = Cookies.get("jwtToken");
  if (!token) {
    // agarlogged in nahi hai toh they will be redirected to landing page. (We can add a static/dummy webpage also)
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

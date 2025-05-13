import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TokenService } from "./token";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = TokenService.isAuthenticated;

  if (!isAuthenticated) {
    // Redirect them to /login, but save the current location they were
    // trying to go to, so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;

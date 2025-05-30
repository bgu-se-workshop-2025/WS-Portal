import { Navigate, Outlet, useLocation } from "react-router-dom";
import { TokenService } from "./token";

const RequireAuth = () => {
  const location = useLocation();
  const isAuthenticated = TokenService.isAuthenticated;

  if (!isAuthenticated) {
    // Redirect them to /login, but save the current location they were
    // trying to go to, so we can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

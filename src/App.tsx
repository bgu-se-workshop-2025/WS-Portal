import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./shared/components/layout/Header";
import Footer from "./shared/components/layout/Footer";

import LoginPage from "./modules/user/login/LoginPage";
import RegisterPage from "./modules/user/register/RegisterPage";
import UserProfilePage from "./modules/user/profile/UserProfilePage";
import RequireAuth from "./shared/utils/RequireAuth";

const App: React.FC = () => {
  const { pathname } = useLocation();

  const noLayoutPaths = ["/login", "/register"];
  const showLayout = !noLayoutPaths.includes(pathname);

  return (
    <>
      {showLayout && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <></>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <UserProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <RequireAuth>
              <></>
            </RequireAuth>
          }
        />
      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;

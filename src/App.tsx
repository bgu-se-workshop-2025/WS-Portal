import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./shared/components/layout/Header";
import Footer from "./shared/components/layout/Footer";

import StorePage from "./modules/store/StorePage";
import LoginPage from "./modules/user/login/LoginPage";
import RegisterPage from "./modules/user/register/RegisterPage";
import UserProfilePage from "./modules/user/profile/UserProfilePage";
import RequireAuth from "./shared/utils/RequireAuth";
import MainPage from "./modules/main/MainPage";
import StoreDiscountsPage from "./modules/store/components/subpages/discounts/StoreDiscountsPage/StoreDiscountsPage";

const App: React.FC = () => {
  const { pathname } = useLocation();

  const noLayoutPaths = ["/login", "/register"];
  const showLayout = !noLayoutPaths.includes(pathname);

  return (
    <>
      {showLayout && <Header />}
      <Box sx={{ overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/store/:storeId/sellers"
            element={<RequireAuth />}
          >
            <Route path="/discounts" element={<StoreDiscountsPage />} />
          </Route>
          <Route
            path="/profile"
            element={<RequireAuth />}
          >
            <Route element={<UserProfilePage />} />
          </Route>
          <Route path="*" element={<MainPage />} />
        </Routes>
      </Box>
      {showLayout && <Footer />}
    </>
  );
};

export default App;

import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./shared/components/layout/Header";
import Footer from "./shared/components/layout/Footer";

import StorePage from "./modules/store/StorePage";
import LoginPage from "./modules/user/login/LoginPage";
import RegisterPage from "./modules/user/register/RegisterPage";
import UserProfilePage from "./modules/user/profile/UserProfilePage";
import RequireAuth from "./shared/utils/RequireAuth";
import MainPage from "./modules/main/MainPage";
import NotificationPage from "./modules/user/notification/NotificationPage";
import AdminPage from "./modules/user/admin/pages/AdminPage";
import RequireAdmin from "./modules/user/admin/RequireAdmin";

import StoreDiscountsPage from "./modules/store/components/subpages/discounts/StoreDiscountsPage/StoreDiscountsPage";
import BidRequestPage from "./modules/Bidding/BidRequestPage";
import BidPage from "./modules/Bidding/BidPage";
import DevPage from "./modules/Bidding/DevPage";
import StoreProductsPage from "./modules/store/components/subpages/products/StoreProductsPage";
import StoreSellersPage from "./modules/store/components/subpages/StoreSellers";
import StoreSettingsPage from "./modules/store/components/subpages/StoreSettings";

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
          <Route path="/register" element={<RegisterPage />} />
          

          // TODO - remove later
          <Route path="/bids" element={<BidRequestPage mode={"store"} />} />
          <Route path="/dev" element={<DevPage />} /> 

          <Route path="/store/:storeId/*" element={<StorePage />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<StoreProductsPage />} />
            <Route path="sellers" element={<StoreSellersPage />} />
            <Route path="settings" element={<StoreSettingsPage />} />
            <Route path="discounts" element={<StoreDiscountsPage />} />
          </Route>

          <Route path="/notifications" element={<NotificationPage />} />
          
          <Route path="/admin" element={<RequireAdmin />}>
            <Route index element={<AdminPage />} />
          </Route>
          <Route path="/profile" element={<RequireAuth />}>
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

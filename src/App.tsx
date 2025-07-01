import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./shared/components/layout/Header";
import Footer from "./shared/components/layout/Footer";

import StorePage from "./modules/store/StorePage";
import LoginPage from "./modules/user/login/LoginPage";
import RegisterPage from "./modules/user/register/RegisterPage";
import UserProfilePage from "./modules/user/profile/UserProfilePage";
import MainPage from "./modules/main/MainPage";
import NotificationPage from "./modules/user/notification/NotificationPage";
import AdminPage from "./modules/user/admin/pages/AdminPage";
import RequireAdmin from "./modules/user/admin/RequireAdmin";

import StoreDiscountsPage from "./modules/store/components/subpages/discounts/StoreDiscountsPage/StoreDiscountsPage";
import PaymentPage from "./modules/order/PaymentPage";
import StoreTransactionsPage from "./modules/store/components/subpages/TransactionsPage/StoreTransactionsPage";
import StoreProductsPage from "./modules/store/components/subpages/products/StoreProductsPage";
import StoreSellersPage from "./modules/store/components/subpages/StoreSellers";
import StoreSettingsPage from "./modules/store/components/subpages/StoreSettings";
import CartMainPage from "./modules/cart/CartMainPage";
import SearchResultsPage from "./modules/search/SearchResultsPage";
import StoreBidRequestPage from "./modules/Bidding/pages/StoreBidRequestPage";
import UserBidPage from "./modules/Bidding/pages/UserBidPage";
import UserBidRequestPage from "./modules/Bidding/pages/UserBidRequestPage";
import StoreBidPage from "./modules/Bidding/pages/StoreBidPage";
import SellerInfoPage from "./modules/store/components/subpages/SellerInfo/SellerInfoPage";



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
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
             
          <Route path="/cart" element={<CartMainPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/store/:storeId/*" element={<StorePage />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<StoreProductsPage />} />
            <Route path="sellers" element={<StoreSellersPage />} />
            <Route path="settings" element={<StoreSettingsPage />} />
            <Route path="discounts" element={<StoreDiscountsPage />} />
            <Route path="transactions" element={<StoreTransactionsPage />} />
            <Route path="bids" element={<StoreBidPage />} />
            <Route path="bids/requests" element={<StoreBidRequestPage />} />
            <Route path="sellers-info" element={<SellerInfoPage />} />

          </Route>

          <Route path="/notifications" element={<NotificationPage />} />

          <Route path="/admin" element={<RequireAdmin />}>
            <Route index element={<AdminPage />} />
          </Route>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/profile/bids" element={<UserBidPage />} />
          <Route path="/profile/bids/requests" element={<UserBidRequestPage />} />


          <Route path="*" element={<MainPage />} />
        </Routes>
      </Box>
      {showLayout && <Footer />}
    </>
  );
};

export default App;

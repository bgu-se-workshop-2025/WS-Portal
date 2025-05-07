import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./shared/components/layout/Header";
import Footer from "./shared/components/layout/Footer";
import LoginPage from "./modules/user/login/LoginPage";

const App: React.FC = () => {
  const { pathname } = useLocation();

  const noLayoutPaths = ["/login"];
  const showLayout = !noLayoutPaths.includes(pathname);

  return (
    <>
      {showLayout && <Header />}
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<></>} />
        </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;

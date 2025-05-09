import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/user/login/LoginPage";
import RegisterPage from "./modules/user/register/RegisterPage";

const rootElement = document.getElementById("App") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<></>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

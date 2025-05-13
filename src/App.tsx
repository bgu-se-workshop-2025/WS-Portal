import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/user/login/LoginPage";
import StorePage from "./modules/store/StorePage";
import RegisterPage from "./modules/user/register/RegisterPage";
import { createTheme, ThemeProvider } from "@mui/material";

const rootElement = document.getElementById("App") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route path="*" element={<></>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

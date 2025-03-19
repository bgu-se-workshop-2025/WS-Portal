import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/LoginPage";

const rootElement = document.getElementById("App") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <LoginPage />
    </React.StrictMode>
);

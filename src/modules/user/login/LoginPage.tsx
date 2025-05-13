import React from "react";
import { useNavigate } from "react-router-dom";
import PaneLayout from "../register/components/PaneLayout/PaneLayout";
import { Button, Typography } from "@mui/material";

import LoginPageResources from "./LoginPageResources.json";
import FormTextField from "../register/components/FormTextField/FormTextField";
import { sdk } from "../../../sdk/sdk";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterNav = () => {
    navigate("/register");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get(LoginPageResources.Main.Form.Username.Id) as string;
    const password = formData.get(LoginPageResources.Main.Form.Password.Id) as string;

    try {
      await sdk.login({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <PaneLayout.Container>
      {/* Side pane: prompt to register */}
      <PaneLayout.Pane>
        <Typography
          variant="h2"
          sx={LoginPageResources.SidePanel.Styles.MarginBottom}
        >
          {LoginPageResources.SidePanel.Title}
        </Typography>
        <Typography
          variant="body1"
          sx={LoginPageResources.SidePanel.Styles.MarginBottom}
        >
          {LoginPageResources.SidePanel.Body}
        </Typography>
        <Button
          onClick={handleRegisterNav}
          variant="outlined"
          color="inherit"
          sx={LoginPageResources.SidePanel.Styles.Button}
        >
          {LoginPageResources.SidePanel.Button.Content}
        </Button>
        OR
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          color="inherit"
          sx={{ color: "black", borderRadius: "1rem", mt: "1rem"}}
        >
          {LoginPageResources.SidePanel.AsGuest}
        </Button>
      </PaneLayout.Pane>

      {/* Main pane: login form */}
      <PaneLayout.Pane main>
        <Typography
          variant="h2"
          sx={LoginPageResources.Main.Styles.MarginBottom}
        >
          {LoginPageResources.Main.Title}
        </Typography>
        <form onSubmit={handleLogin}>
          <FormTextField
            id={LoginPageResources.Main.Form.Username.Id}
            label={LoginPageResources.Main.Form.Username.Label}
            placeholder={LoginPageResources.Main.Form.Username.Placeholder}
            required
          />
          <FormTextField
            id={LoginPageResources.Main.Form.Password.Id}
            label={LoginPageResources.Main.Form.Password.Label}
            placeholder={LoginPageResources.Main.Form.Password.Placeholder}
            type="password"
            required
          />
          <Button
            variant="contained"
            type="submit"
            sx={LoginPageResources.Main.Styles.Button}
          >
            {LoginPageResources.Main.Form.Button.Content}
          </Button>
        </form>
      </PaneLayout.Pane>
    </PaneLayout.Container>
  );
};

export default LoginPage;

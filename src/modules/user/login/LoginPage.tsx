import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaneLayout from "../register/components/PaneLayout/PaneLayout";
import { Button, Typography, Box } from "@mui/material";

import LoginPageResources from "./LoginPageResources.json";
import FormTextField from "../register/components/FormTextField/FormTextField";
import { sdk } from "../../../sdk/sdk";
import { useErrorHandler } from "../../../shared/hooks/useErrorHandler";
import ErrorDisplay from "../../../shared/components/ErrorDisplay";
import { ErrorHandler } from "../../../shared/utils/errorHandler";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler({
    autoClear: false,
    onError: (error) => {
      // Handle authentication errors specifically
      ErrorHandler.handleAuthError(error);
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterNav = () => {
    navigate("/register");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get(LoginPageResources.Main.Form.Username.Id) as string;
    const password = formData.get(LoginPageResources.Main.Form.Password.Id) as string;

    try {
      await sdk.login({ username, password });
      navigate("/");
    } catch (error) {
      const context = ErrorHandler.createContext('LoginPage', 'handleLogin', { username });
      handleError(error, context);
    } finally {
      setIsLoading(false);
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
          sx={{ color: "black", borderRadius: "1rem", mt: "1rem" }}
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
          
          <Box mt={2}>
            <ErrorDisplay
              error={error}
              variant="alert"
              showRetry={true}
              onRetry={() => {
                clearError();
                // Re-submit the form
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }}
            />
          </Box>
          
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={LoginPageResources.Main.Styles.Button}
          >
            {isLoading ? "Logging in..." : LoginPageResources.Main.Form.Button.Content}
          </Button>
        </form>
      </PaneLayout.Pane>
    </PaneLayout.Container>
  );
};

export default LoginPage;

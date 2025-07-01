import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaneLayout from "../register/components/PaneLayout/PaneLayout";
import { Button, Typography, CircularProgress } from "@mui/material";

import LoginPageResources from "./LoginPageResources.json";
import FormTextField from "../register/components/FormTextField/FormTextField";
import { sdk } from "../../../sdk/sdk";
import { useFormErrorHandler } from "../../../shared/hooks/useErrorHandler";
import { InlineError } from "../../../shared/components/error/ErrorDisplay";
import type { AppError } from "../../../shared/types/errors";
import { ErrorType, ErrorSeverity } from "../../../shared/types/errors";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    error,
    handleFormSubmit,
    clearError
  } = useFormErrorHandler({
    component: 'LoginPage',
    operation: 'User Login'
  });

  // Create a custom error message for login failures
  const displayError: AppError | null = error && error.type === ErrorType.UNKNOWN_ERROR 
    ? {
        ...error,
        type: ErrorType.INVALID_CREDENTIALS,
        severity: ErrorSeverity.WARNING,
        title: 'Invalid Credentials',
        message: 'The username or password you entered is incorrect',
        userFriendlyMessage: 'The username or password you entered is incorrect. Please check your credentials and try again.',
        actionable: true,
        retryable: true,
        suggestedActions: ['Double-check your username and password', 'Reset your password if you forgot it', 'Register a new account if you don\'t have one']
      }
    : error;

  const handleRegisterNav = () => {
    navigate("/register");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get(LoginPageResources.Main.Form.Username.Id) as string;
    const password = formData.get(LoginPageResources.Main.Form.Password.Id) as string;

    setIsLoading(true);

    const { data, error: loginError } = await handleFormSubmit(async () => {
      return await sdk.login({ username, password });
    });

    setIsLoading(false);

    if (data) {
      navigate("/");
    }
    // Error is already handled by the form error handler
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
          
          <InlineError 
            error={displayError} 
            onDismiss={clearError}
            onRetry={displayError?.retryable ? () => {
              const form = document.querySelector('form') as HTMLFormElement;
              if (form) {
                handleLogin({ preventDefault: () => {}, currentTarget: form } as any);
              }
            } : undefined}
          />
          
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={LoginPageResources.Main.Styles.Button}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {isLoading ? 'Signing In...' : LoginPageResources.Main.Form.Button.Content}
          </Button>
        </form>
      </PaneLayout.Pane>
    </PaneLayout.Container>
  );
};

export default LoginPage;

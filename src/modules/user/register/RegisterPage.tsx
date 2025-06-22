import { useNavigate } from "react-router-dom";
import PaneLayout from "./components/PaneLayout/PaneLayout";
import RegisterPageResources from "./RegisterPageResources.json";
import { Button, Typography, Box } from "@mui/material";
import FormTextField from "./components/FormTextField/FormTextField";
import {
  isValidEmailAddress,
  isValidPassword,
  isValidStringProperty,
  isValidUsername,
} from "./utils/formValidationsUtil";

import { sdk } from "../../../sdk/sdk";
import { useErrorHandler } from "../../../shared/hooks/useErrorHandler";
import { useFormErrors } from "../../../shared/hooks/useErrorHandler";
import ErrorDisplay from "../../../shared/components/ErrorDisplay";
import { ErrorHandler } from "../../../shared/utils/errorHandler";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler({
    autoClear: false,
  });
  const { fieldErrors, setFieldError, clearFieldError, clearAllErrors } = useFormErrors();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const validateForm = (formData: FormData): boolean => {
    clearAllErrors();
    let isValid = true;

    const firstName = formData.get(RegisterPageResources.Main.Form.FirstName.Id) as string;
    const lastName = formData.get(RegisterPageResources.Main.Form.LastName.Id) as string;
    const username = formData.get(RegisterPageResources.Main.Form.Username.Id) as string;
    const email = formData.get(RegisterPageResources.Main.Form.Email.Id) as string;
    const password = formData.get(RegisterPageResources.Main.Form.Password.Id) as string;

    // Validate first name
    if (!isValidStringProperty(firstName)) {
      setFieldError('firstName', 'First name is required and must be at least 2 characters long');
      isValid = false;
    }

    // Validate last name
    if (!isValidStringProperty(lastName)) {
      setFieldError('lastName', 'Last name is required and must be at least 2 characters long');
      isValid = false;
    }

    // Validate username
    if (!isValidUsername(username)) {
      setFieldError('username', 'Username must be 3-20 characters long and contain only letters, numbers, dots, underscores, and hyphens');
      isValid = false;
    }

    // Validate email
    if (!isValidEmailAddress(email)) {
      setFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!isValidPassword(password)) {
      setFieldError('password', 'Password must be at least 8 characters long and contain uppercase, lowercase, and number');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    clearAllErrors();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }

    const firstName = formData.get(RegisterPageResources.Main.Form.FirstName.Id) as string;
    const lastName = formData.get(RegisterPageResources.Main.Form.LastName.Id) as string;
    const username = formData.get(RegisterPageResources.Main.Form.Username.Id) as string;
    const email = formData.get(RegisterPageResources.Main.Form.Email.Id) as string;
    const password = formData.get(RegisterPageResources.Main.Form.Password.Id) as string;

    try {
      await sdk.register({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      const context = ErrorHandler.createContext('RegisterPage', 'handleRegister', { 
        username, 
        email 
      });
      handleError(error, context);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaneLayout.Container>
      <PaneLayout.Pane>
        <Typography variant="h2" sx={RegisterPageResources.Styles.MarginBottom}>
          {RegisterPageResources.SidePanel.Title}
        </Typography>
        <Typography variant="body1">
          {RegisterPageResources.SidePanel.Body}
        </Typography>
        <Button
          onClick={handleLogin}
          variant="outlined"
          color="inherit"
          sx={RegisterPageResources.Styles.Button}
        >
          {RegisterPageResources.SidePanel.Button}
        </Button>
      </PaneLayout.Pane>
      
      <PaneLayout.Pane main>
        <Typography variant="h2" sx={RegisterPageResources.Styles.MarginBottom}>
          {RegisterPageResources.Main.Title}
        </Typography>
        
        <form onSubmit={handleRegister}>
          <FormTextField
            id={RegisterPageResources.Main.Form.FirstName.Id}
            label={RegisterPageResources.Main.Form.FirstName.Label}
            placeholder={RegisterPageResources.Main.Form.FirstName.Placeholder}
            required
            validation={(value) => {
              if (!isValidStringProperty(value)) {
                setFieldError('firstName', 'First name is required and must be at least 2 characters long');
                return false;
              }
              clearFieldError('firstName');
              return true;
            }}
          />
          
          <FormTextField
            id={RegisterPageResources.Main.Form.LastName.Id}
            label={RegisterPageResources.Main.Form.LastName.Label}
            placeholder={RegisterPageResources.Main.Form.LastName.Placeholder}
            required
            validation={(value) => {
              if (!isValidStringProperty(value)) {
                setFieldError('lastName', 'Last name is required and must be at least 2 characters long');
                return false;
              }
              clearFieldError('lastName');
              return true;
            }}
          />
          
          <FormTextField
            id={RegisterPageResources.Main.Form.Username.Id}
            label={RegisterPageResources.Main.Form.Username.Label}
            placeholder={RegisterPageResources.Main.Form.Username.Placeholder}
            required
            infoPop={RegisterPageResources.Main.Form.Username.Info}
            validation={(value) => {
              if (!isValidUsername(value)) {
                setFieldError('username', 'Username must be 3-20 characters long and contain only letters, numbers, dots, underscores, and hyphens');
                return false;
              }
              clearFieldError('username');
              return true;
            }}
          />
          
          <FormTextField
            id={RegisterPageResources.Main.Form.Email.Id}
            label={RegisterPageResources.Main.Form.Email.Label}
            placeholder={RegisterPageResources.Main.Form.Email.Placeholder}
            required
            infoPop={RegisterPageResources.Main.Form.Email.Info}
            validation={(value) => {
              if (!isValidEmailAddress(value)) {
                setFieldError('email', 'Please enter a valid email address');
                return false;
              }
              clearFieldError('email');
              return true;
            }}
          />
          
          <FormTextField
            id={RegisterPageResources.Main.Form.Password.Id}
            label={RegisterPageResources.Main.Form.Password.Label}
            placeholder={RegisterPageResources.Main.Form.Password.Placeholder}
            type="password"
            required
            infoPop={RegisterPageResources.Main.Form.Password.Info}
            validation={(value) => {
              if (!isValidPassword(value)) {
                setFieldError('password', 'Password must be at least 8 characters long and contain uppercase, lowercase, and number');
                return false;
              }
              clearFieldError('password');
              return true;
            }}
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
            sx={RegisterPageResources.Styles.Button}
          >
            {isLoading ? "Creating Account..." : RegisterPageResources.Main.Form.Button.Content}
          </Button>
        </form>
      </PaneLayout.Pane>
    </PaneLayout.Container>
  );
};

export default RegisterPage;

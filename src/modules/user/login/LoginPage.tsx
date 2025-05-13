import React from "react";
import { Box, Typography, Button } from "@mui/material";

import LoginTextField from "./components/LoginTextField";

import { SharedResources } from "../../../shared/Resources.json";
import { Resources } from "./LoginPageResources.json";

import { sdk } from "../../../sdk/sdk";

import { useEffect } from "react";
import { client } from "../../../sdk/modules/notification/notification";

const LoginPage: React.FC = () => {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    client.activate();
  }, [])

  const handleLogin = async () => {
    try {
      const { token } = await sdk.login({ username, password });
      console.log("Login successful, token:", token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        ...SharedResources.Styles.FlexboxRow,
        ...SharedResources.Styles.FullScreenHeight,
      }}
    >
      <Box
        sx={{
          ...Resources.Styles.MainContainer,
          ...SharedResources.Styles.FlexboxCol,
          ...SharedResources.Styles.AlignCenter,
        }}
      >
        <Typography variant="h2">{Resources.Content.LoginTitle}</Typography>
        <LoginTextField {...Resources.Content.Fields.User} setState={setUsername} />
        <LoginTextField {...Resources.Content.Fields.Password} setState={setPassword} />
        <Button variant="contained" sx={Resources.Styles.Button} onClick={handleLogin}>
          {Resources.Content.LoginButton}
        </Button>
      </Box>
      <Box
        sx={{
          ...Resources.Styles.SideContainer,
          ...SharedResources.Styles.FlexboxCol,
          ...SharedResources.Styles.AlignCenter,
        }}
      >
        <Typography variant="h2">{Resources.Content.SignupTitle}</Typography>
        <Typography variant="body1">
          {Resources.Content.SignupDescription}
        </Typography>
        <Button variant="outlined" color="inherit" sx={Resources.Styles.Button}>
          {Resources.Content.SignupButton}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;

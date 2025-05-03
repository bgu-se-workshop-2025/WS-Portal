import React from "react";
import { Box, Typography, Button } from "@mui/material";

import LoginTextField from "./components/LoginTextField";

import { SharedResources } from "../../shared/Resources.json";
import { Resources } from "./LoginPageResources.json";

const LoginPage: React.FC = () => {
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
        <LoginTextField {...Resources.Content.Fields.User} />
        <LoginTextField {...Resources.Content.Fields.Password} />
        <Button variant="contained" sx={Resources.Styles.Button}>
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

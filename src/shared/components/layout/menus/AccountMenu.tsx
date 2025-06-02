import React, { useMemo } from "react";
import {
  Box,
  Paper,
  IconButton,
  Collapse,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";

import { AccountCircleOutlined } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../../sdk/sdk";
import { TokenService } from "../../../../shared/utils/token";

const AccountMenu: React.FC = () => {
  const [accountOpen, setAccountOpen] = React.useState(false);

  const navigate = useNavigate();

  const userButtons = useMemo(
    () => [
      {
        label: (TokenService.username ?? "User") + "'s Profile",
        onClick: () => navigate("/profile"),
      },
      {
        label: "Logout",
        onClick: () => {
          setAccountOpen(false);
          TokenService.clearToken();
          navigate("/");
          window.location.reload();
        },
      },
    ],
    []
  );

  const guestButtons = [
    {
      label: "Login",
      onClick: () => navigate("/login"),
    },
    {
      label: "Register",
      onClick: () => navigate("/register"),
    },
  ];

  const buttons = isAuthenticated() ? userButtons : guestButtons;

  return (
    <ClickAwayListener onClickAway={() => setAccountOpen(false)}>
      <Box position="relative">
        <IconButton
          color="inherit"
          onClick={() => {
            setAccountOpen((o) => !o);
          }}
        >
          <AccountCircleOutlined />
        </IconButton>
        <Collapse in={accountOpen}>
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              mt: 1,
              width: 200,
            }}
          >
            <List dense>
              {buttons.map((button) => (
                <ListItem disablePadding key={button.label}>
                  <ListItemButton onClick={button.onClick}>
                    <Typography variant="body2">{button.label}</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default AccountMenu;

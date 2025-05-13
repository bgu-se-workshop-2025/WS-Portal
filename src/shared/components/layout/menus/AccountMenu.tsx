import React from "react";
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

const AccountMenu: React.FC = () => {
  const [accountOpen, setAccountOpen] = React.useState(false);

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
              <ListItem disablePadding>
                <ListItemButton>
                  <Typography variant="body2">Profile</Typography>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <Typography variant="body2">Settings</Typography>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <Typography variant="body2">Logout</Typography>
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default AccountMenu;

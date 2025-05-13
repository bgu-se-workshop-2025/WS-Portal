import React from "react";
import {
  Box,
  IconButton,
  Collapse,
  Paper,
  List,
  ListItem,
  Typography,
  ListItemButton,
  ClickAwayListener,
} from "@mui/material";
import {
  NotificationsOutlined,
  ShoppingCartOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";

const IconBar: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Notifications */}
      <ClickAwayListener onClickAway={() => setNotificationsOpen(false)}>
        <Box position="relative">
          <IconButton
            color="inherit"
            onClick={() => {
              setNotificationsOpen((o) => !o);
            }}
          >
            <NotificationsOutlined />
          </IconButton>
          <Collapse in={notificationsOpen}>
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                right: 0,
                mt: 1,
                width: 240,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <List dense>
                <ListItem>
                  <Typography variant="body2">
                    New comment on your post
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body2">
                    Your order has shipped
                  </Typography>
                </ListItem>
                {/* …more items… */}
              </List>
            </Paper>
          </Collapse>
        </Box>
      </ClickAwayListener>

      {/* Shopping Cart */}
      <ClickAwayListener onClickAway={() => setCartOpen(false)}>
        <Box position="relative">
          <IconButton
            color="inherit"
            onClick={() => {
              setCartOpen((o) => !o);
            }}
          >
            <ShoppingCartOutlined />
          </IconButton>
          <Collapse in={cartOpen}>
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                right: 0,
                mt: 1,
                width: 280,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <List dense>
                <ListItem>
                  <Typography variant="body2">
                    1× “Wireless Mouse” — $25.99
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body2">
                    2× “USB-C Cable” — $9.99 each
                  </Typography>
                </ListItem>
                {/* …more cart items… */}
              </List>
            </Paper>
          </Collapse>
        </Box>
      </ClickAwayListener>

      {/* Account Menu */}
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
    </Box>
  );
};

export default IconBar;

import React from "react";
import {
  Box,
  Paper,
  IconButton,
  Collapse,
  ClickAwayListener,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { NotificationsOutlined } from "@mui/icons-material";

const NotificationMenu: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const notifications = [
    { id: 1, message: "New comment on your post" },
    { id: 2, message: "Your order has shipped" },
    { id: 3, message: "New follower" },
    { id: 4, message: "New like on your photo" },
    // Add more notifications as needed
  ];

  return (
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
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default NotificationMenu;

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
  ListItemText,
  Divider,
} from "@mui/material";

import { NotificationsOutlined, OpenInNewOutlined } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../../../shared/hooks/useNotifications";
import { NotificationPayload } from "../../../../shared/types/responses";

const NotificationMenu: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const { notifications } = useNotifications();
  const { connected } = useNotifications();

  const navigate = useNavigate();

  if (!connected) {
    return (
      <Box p={2}>
        <Typography color="error">Not connected to notifications.</Typography>
      </Box>
    );
  }
  
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
            <IconButton onClick={() => {
              setNotificationsOpen(false);
              navigate("/notifications");
            }}>
              <OpenInNewOutlined />
            </IconButton>
            {notifications.length === 0 ? (
              <Box p={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <List dense>
                {notifications.map((n: NotificationPayload) => (
                  <React.Fragment key={n.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={n.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {n.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {new Date(n.timestamp).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default NotificationMenu;

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

import { NotificationsOutlined } from "@mui/icons-material";

import { useAuthentications, NotificationPayload } from "../../../../shared/hooks/useNotifications";

const NotificationMenu: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const { connected, notifications } = useAuthentications();

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
                        sx={{ display: 'block' }}
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
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default NotificationMenu;

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
              <ListItem>
                <Typography variant="body2">
                  New comment on your post
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body2">Your order has shipped</Typography>
              </ListItem>
              {/* …more items… */}
            </List>
          </Paper>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default NotificationMenu;

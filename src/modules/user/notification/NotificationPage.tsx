import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import { NotificationPayload } from "../../../shared/types/responses";

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [page, setPage] = useState(0);
  const size = 5;
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const didInitialLoad = useRef(false);

  const loadPage = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await sdk.getNotifications({ page, size });
      console.log("fetched page", page, data);
      setNotifications((old) => [...old, ...data]);
      if (data.length < size) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ── If we've already done the initial load, skip the second StrictMode call ─
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;

    loadPage();
  }, []);

  return (
    <Box p={2} maxWidth={600} mx="auto">
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <List>
        {notifications.map((n) => (
          <React.Fragment key={n.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box display="flex" flexDirection="column">
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {n.content}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      {hasMore && (
        <Box textAlign="center" my={2}>
          <Button variant="outlined" disabled={loading} onClick={loadPage}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </Box>
      )}
      {!hasMore && notifications.length > 0 && (
        <Box textAlign="center" my={2}>
          <Typography variant="caption" color="text.secondary">
            You’ve reached the end.
          </Typography>
        </Box>
      )}
      {!hasMore && notifications.length === 0 && !loading && (
        <Box p={2} textAlign="center">
          <Typography color="text.secondary">
            No notifications to show.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotificationPage;

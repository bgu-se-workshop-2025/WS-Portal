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
                      {(() => {
                        console.log('Full notification object (page):', n);
                        console.log('Notification page timestamp:', n.createdAt, typeof n.createdAt);
                        
                        if (!n.createdAt) {
                          return 'No timestamp';
                        }
                        
                        let date;
                        if (typeof n.createdAt === 'string') {
                          date = new Date(n.createdAt);
                        } else if (typeof n.createdAt === 'number') {
                          // Check if it's in seconds (Unix timestamp) or milliseconds
                          date = n.createdAt > 1000000000000 
                            ? new Date(n.createdAt) 
                            : new Date(n.createdAt * 1000);
                        } else {
                          return `Invalid timestamp type: ${typeof n.createdAt}`;
                        }
                        
                        // Format date in Israeli format (Hebrew locale)
                        return date.toLocaleString('he-IL', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false // 24-hour format
                        });
                      })()}
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

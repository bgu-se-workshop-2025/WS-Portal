import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, Store as StoreIcon, Person as PersonIcon } from "@mui/icons-material";
import { sdk } from "../../../sdk/sdk";
import { MessageDto } from "../../../shared/types/dtos";
import { UserProfileTabProps } from "./UserProfileTabs";

const MyMessagesTab: React.FC<UserProfileTabProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [receivedMessages, setReceivedMessages] = useState<MessageDto[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state for viewing full message
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageDto | null>(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, activeTab]);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === "received") {
        const data = await sdk.getMessages();
        setReceivedMessages(data);
      } else {
        const data = await sdk.getSentMessages();
        setSentMessages(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: "received" | "sent") => {
    setActiveTab(newValue);
  };

  const handleViewMessage = (message: MessageDto) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMessage(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  const getMessageIcon = (message: MessageDto) => {
    // If the senderId is a UUID that doesn't match the current user, it's likely from a store
    if (activeTab === "received" && message.senderId && message.senderId !== user.id) {
      return <StoreIcon sx={{ color: "primary.main", mr: 1 }} />;
    }
    return <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />;
  };

  const getMessageLabel = (message: MessageDto) => {
    if (activeTab === "received" && message.senderId && message.senderId !== user.id) {
      return (
        <Chip 
          label="Store Response" 
          size="small" 
          color="primary" 
          variant="outlined"
          icon={<StoreIcon />}
        />
      );
    }
    return null;
  };

  const currentMessages = activeTab === "received" ? receivedMessages : sentMessages;

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color="primary" mb={3}>
        📬 My Messages
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        View your messages and responses from stores you've contacted.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab 
            value="received" 
            label={`Received Messages (${receivedMessages.length})`}
            icon={<StoreIcon />}
            iconPosition="start"
          />
          <Tab 
            value="sent" 
            label={`Sent Messages (${sentMessages.length})`}
            icon={<PersonIcon />}
            iconPosition="start"
          />
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : currentMessages.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" mb={2}>
              {activeTab === "received" 
                ? "No messages received yet." 
                : "No messages sent yet."}
            </Typography>
            {activeTab === "received" && (
              <Typography variant="body2" color="text.secondary">
                When stores respond to your inquiries, they will appear here.
              </Typography>
            )}
          </Box>
        ) : (
          <List>
            {currentMessages.map((message, index) => (
              <React.Fragment key={message.id || index}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{ px: 0, cursor: "pointer" }}
                  onClick={() => handleViewMessage(message)}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                        {getMessageIcon(message)}
                        <Typography variant="h6" component="span" flex={1}>
                          {message.title}
                        </Typography>
                        {getMessageLabel(message)}
                        <Chip
                          label={formatDate(message.date)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Box mt={1}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                          }}
                        >
                          {message.body}
                        </Typography>
                        <Button
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(message);
                          }}
                        >
                          Read Full Message
                        </Button>
                      </Box>
                    }
                    secondaryTypographyProps={{
                      component: "div"
                    }}
                  />
                </ListItem>
                {index < currentMessages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Full Message Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {selectedMessage && getMessageIcon(selectedMessage)}
              <Typography variant="h6">
                {selectedMessage?.title}
              </Typography>
              {selectedMessage && getMessageLabel(selectedMessage)}
            </Stack>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {selectedMessage && formatDate(selectedMessage.date)}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {selectedMessage?.body}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyMessagesTab; 
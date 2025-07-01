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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { sdk } from "../../../../sdk/sdk";
import { MessageDto } from "../../../../shared/types/dtos";

interface StoreMessagesProps {}

const StoreMessages: React.FC<StoreMessagesProps> = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [activeTab, setActiveTab] = useState<"requests" | "responses">("requests");
  const [requests, setRequests] = useState<MessageDto[]>([]);
  const [responses, setResponses] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageDto | null>(null);
  const [responseTitle, setResponseTitle] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (storeId) {
      loadMessages();
    }
  }, [storeId, activeTab]);

  const loadMessages = async () => {
    if (!storeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === "requests") {
        const data = await sdk.getStoreRequests(storeId);
        setRequests(data);
      } else {
        const data = await sdk.getStoreResponses(storeId);
        setResponses(data);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load messages";
      if (errorMessage.includes("seller of this store") || errorMessage.includes("IllegalAccessError")) {
        setError("You don't have permission to view messages for this store. Please make sure you're a seller of this store.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRespondClick = (message: MessageDto) => {
    setSelectedMessage(message);
    setResponseTitle(`Re: ${message.title}`);
    setResponseBody("");
    setResponseDialogOpen(true);
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !storeId || !responseTitle.trim() || !responseBody.trim()) return;
    
    setSubmitting(true);
    try {
      const response: MessageDto = {
        senderId: storeId,
        recipientId: selectedMessage.senderId!,
        title: responseTitle,
        body: responseBody,
      };
      
      await sdk.respondToStoreRequest(storeId, selectedMessage.id!, response);
      setResponseDialogOpen(false);
      setSelectedMessage(null);
      setResponseTitle("");
      setResponseBody("");
      
      // Reload messages to show the new response
      loadMessages();
    } catch (err: any) {
      setError(err.message || "Failed to send response");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: "requests" | "responses") => {
    setActiveTab(newValue);
  };

  const currentMessages = activeTab === "requests" ? requests : responses;

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color="primary" mb={3}>
        💬 Store Messages
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {error.includes("permission to view messages") && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                To access store messages, please navigate to <strong>Profile → My Stores</strong> and select a store where you are a seller.
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab value="requests" label={`Incoming Messages (${requests.length})`} />
          <Tab value="responses" label={`Sent Responses (${responses.length})`} />
        </Tabs>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : currentMessages.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {activeTab === "requests" 
                ? "No incoming messages from customers yet." 
                : "No responses sent yet."}
            </Typography>
          </Box>
        ) : (
          <List>
            {currentMessages.map((message, index) => (
              <React.Fragment key={message.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6" component="span">
                          {message.title}
                        </Typography>
                        <Chip
                          label={formatDate(message.date)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    }
                    secondary={
                      <Box mt={1}>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {message.body}
                        </Typography>
                        {activeTab === "requests" && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRespondClick(message)}
                          >
                            Respond
                          </Button>
                        )}
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

      {/* Response Dialog */}
      <Dialog 
        open={responseDialogOpen} 
        onClose={() => setResponseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Respond to Message</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Original Message:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: "italic", mb: 2 }}>
                "{selectedMessage.body}"
              </Typography>
            </Box>
          )}
          
          <TextField
            label="Response Title"
            value={responseTitle}
            onChange={(e) => setResponseTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Response Message"
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendResponse}
            variant="contained"
            disabled={submitting || !responseTitle.trim() || !responseBody.trim()}
          >
            {submitting ? "Sending..." : "Send Response"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreMessages; 
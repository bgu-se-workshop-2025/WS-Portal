import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { sdk, isAuthenticated } from "../../../../sdk/sdk";
import { MessageDto } from "../../../../shared/types/dtos";

interface ContactStoreDialogProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeName: string;
}

const ContactStoreDialog: React.FC<ContactStoreDialogProps> = ({
  open,
  onClose,
  storeId,
  storeName,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);



  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setError("Please fill in both title and message fields.");
      return;
    }

    if (!isAuthenticated()) {
      setError("You must be logged in to send a message. Please log in and try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const message: MessageDto = {
        recipientId: storeId,
        title: title.trim(),
        body: body.trim(),
      };
      
      await sdk.createMessage(message);
      setSuccess(true);
      setTitle("");
      setBody("");
      
      // Close dialog after a brief delay to show success message
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Message send error:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setBody("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Contact {storeName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Message sent successfully!
            </Alert>
          )}
          <TextField
            fullWidth
            label="Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            disabled={submitting}
            placeholder="Enter your message subject"
          />
          <TextField
            fullWidth
            label="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            disabled={submitting}
            placeholder="Enter your message content"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This message will be sent to the store managers.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={submitting || !title.trim() || !body.trim()}
        >
          {submitting ? "Sending..." : "Send Message"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactStoreDialog; 
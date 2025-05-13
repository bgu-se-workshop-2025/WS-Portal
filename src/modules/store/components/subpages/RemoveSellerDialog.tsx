import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  sellerName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveSellerDialog: React.FC<Props> = ({
  open,
  sellerName,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Remove Seller</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to remove <strong>{sellerName}</strong>?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        Remove
      </Button>
    </DialogActions>
  </Dialog>
);

export default RemoveSellerDialog;

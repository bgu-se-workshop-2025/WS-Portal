import React, { useState, useEffect } from "react";
import useBid from "./hooks/useBid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  useTheme,
  IconButton,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CreateBidRequestDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  storeId: string;
  onBidCreated?: () => void;
}

const CreateBidRequestDialog: React.FC<CreateBidRequestDialogProps> = ({
  open,
  onClose,
  productId,
  storeId,
  onBidCreated,
}) => {
  const theme = useTheme();
  const { createBidRequest, loading, error, resetError } = useBid();
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setPrice(undefined);
      resetError();
    }
  }, [open, resetError]);

  const handleSubmit = async () => {
    if (price === undefined || price <= 0) return;

    try {
      await createBidRequest({
        bidRequestId: "",
        userId: "",
        productId,
        storeId,
        price,
        requestStatus: "PENDING",
      });
      onBidCreated?.();
      onClose();
      setShowSuccess(true);
    } catch {
      // keep dialog open so error shows
    }
  };

  const handleClose = () => {
    onClose();
    resetError();
  };

  const isSubmitting = loading.create;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Submit Bid Request
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: theme.spacing(1),
              top: theme.spacing(1),
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid container size={{xs: 12}}>
                <TextField
                  label="Bid Price"
                  type="number"
                  value={price ?? ""}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? undefined : +e.target.value)
                  }
                  fullWidth
                  required
                  disabled={isSubmitting}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>

              {error && (
                <Grid container size={{xs: 12}}>
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || price === undefined || price <= 0}
          >
            {isSubmitting ? "Submitting…" : "Submit Bid"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Created bid request successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default CreateBidRequestDialog;

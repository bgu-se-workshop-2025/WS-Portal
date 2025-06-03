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
import { BidRequestDto } from "../../shared/types/dtos";

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
  const { createBidRequest, loading, error } = useBid();
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setPrice(undefined);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (price === undefined || price <= 0) {
      return;
    }

    try {
      const bidRequest: BidRequestDto = {
        bidRequestId: "",
        productId,
        storeId,
        price,
        requestStatus: "PENDING" as any,
      };

      await createBidRequest(bidRequest);

      onBidCreated?.();
      onClose();
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Error creating bid request:", err);
    }
  };

  const isSubmitDisabled = loading || price === undefined || price <= 0;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Submit Bid Request
          <IconButton
            aria-label="close"
            onClick={onClose}
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
          <Box sx={{ mt: theme.spacing(1) }}>
            <Grid container spacing={2}>
              <Grid container size={{ xs: 12 }}>
                <TextField
                  label="Bid Price"
                  type="number"
                  value={price ?? ""}
                  onChange={(e) =>
                    setPrice(e.target.value === "" ? undefined : +e.target.value)
                  }
                  fullWidth
                  required
                  disabled={loading}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>

              {error && (
                <Grid container size={{ xs: 12 }}>
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {loading ? "Submitting…" : "Submit Bid"}
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

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { sdk } from "../../sdk/sdk";
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

  const [price, setPrice] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setPrice(undefined);
      setSubmitError(undefined);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (price === undefined || price <= 0) {
      setSubmitError("Please enter a valid bid price.");
      return;
    }

    setSubmitting(true);
    setSubmitError(undefined);

    try {
      const bidRequest: BidRequestDto = {
        bidRequestId: "",
        productId,
        storeId,
        price,
        requestStatus: 'PENDING' as any,
      };

      console.log("Creating bid request:", bidRequest);
      console.log("price:", price);
      await sdk.createBidRequest(bidRequest);

      if (onBidCreated) {
        onBidCreated();
      }

      onClose();
    } catch (err: any) {
      console.error("Error creating bid request:", err);
      setSubmitError(err.message || "Failed to create bid request.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || price === undefined || price <= 0;

  return (
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
            <Grid container size = {{xs: 12}}>
              <TextField
                label="Bid Price"
                type="number"
                value={price ?? ""}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? undefined : +e.target.value)
                }
                fullWidth
                required
                disabled={submitting}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            {submitError && (
              <Grid container size = {{xs: 12}}>
                <Alert severity="error" variant="outlined">
                  {submitError}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          {submitting ? "Submitting…" : "Submit Bid"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBidRequestDialog;

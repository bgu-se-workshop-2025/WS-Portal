import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Box,
  Grid,
  TextField,
  Autocomplete,
  DialogActions,
  Button,
  Alert,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ProductDto } from "../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../sdk/sdk";

interface UpdateProductDialogProps {
  open: boolean;
  storeId: string;
  existingProduct: ProductDto;
  onClose: () => void;
  onProductUpdated: (updated: ProductDto) => void;
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  open,
  storeId,
  existingProduct,
  onClose,
  onProductUpdated,
}) => {
  const theme = useTheme();

  // Convert backend auction date format to datetime-local format
  const getInitialAuctionEnd = () => {
    if (!existingProduct.auctionEndDate) return "";
    
    try {
      // Try to parse as ISO format first (new format)
      const date = new Date(existingProduct.auctionEndDate);
      if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 16);
      }
      
      // Fallback: try old format "HH:mm:ss dd/MM/yyyy" for backward compatibility
      const parts = existingProduct.auctionEndDate.split(' ');
      if (parts.length === 2) {
        const [timePart, datePart] = parts;
        const [hours, minutes] = timePart.split(':');
        const [day, month, year] = datePart.split('/');
        
        // Convert to ISO format for datetime-local input
        const fallbackDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
        return fallbackDate.toISOString().slice(0, 16);
      }
      
      return "";
    } catch {
      return "";
    }
  };
  
  const initialAuctionEnd = getInitialAuctionEnd();

  // Initialize form fields from `existingProduct`
  const [name, setName] = useState(existingProduct.name);
  const [desc, setDesc] = useState(existingProduct.description);
  const [price, setPrice] = useState<number | undefined>(existingProduct.price);
  const [quantity, setQuantity] = useState<number | undefined>(
    existingProduct.quantity
  );
  const [categories, setCategories] = useState<string[]>([
    ...existingProduct.categories,
  ]);
  const [auctionEnd, setAuctionEnd] = useState<string>(initialAuctionEnd);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();

  // Whenever the dialog re‐opens with a (possibly new) product, reset all fields.
  useEffect(() => {
    if (open) {
      setName(existingProduct.name);
      setDesc(existingProduct.description);
      setPrice(existingProduct.price);
      setQuantity(existingProduct.quantity);
      setCategories([...existingProduct.categories]);
      setAuctionEnd(getInitialAuctionEnd());
      setSaveError(undefined);
      setSaving(false);
    }
  }, [open, existingProduct]);

  const handleUpdate = async () => {
    // Basic validation: name & price required
    if (name.trim().length === 0 || price === undefined) return;

    // Validate auction date if provided
    if (auctionEnd) {
      const auctionDate = new Date(auctionEnd);
      const now = new Date();
      if (auctionDate <= now) {
        setSaveError("The product's auction date needs to be set in the future");
        return;
      }
    }

    setSaving(true);
    setSaveError(undefined);

    try {
      // Use ISO format for auction date if provided
      let formattedAuctionDate: string | undefined = undefined;
      if (auctionEnd) {
        // Send the date in ISO format that the backend can parse
        formattedAuctionDate = new Date(auctionEnd).toISOString();
        console.log("🔍 DEBUG: Sending auction date:", formattedAuctionDate);
      } else if (existingProduct.auctionEndDate) {
        // Keep existing auction date if user didn't change it
        formattedAuctionDate = existingProduct.auctionEndDate;
        console.log("🔍 DEBUG: Keeping existing auction date:", formattedAuctionDate);
      }

      const toUpdate: ProductDto = {
        ...existingProduct,
        name: name.trim(),
        description: desc.trim(),
        price: price,
        quantity: quantity ?? 0,
        categories,
        auctionEndDate: formattedAuctionDate,
      };

      const updated: ProductDto = await sdk.updateProduct(
        storeId,
        existingProduct.id,
        toUpdate
      );
      onProductUpdated(updated);
    } catch (err: any) {
      console.error("Error updating product:", err);
      setSaveError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };
  
  const handleOnEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAuctionEnd(new Date(value).toISOString());
  };

  const isSaveDisabled =
    saving || name.trim().length === 0 || price === undefined;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Product
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
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                disabled={saving}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <TextField
                label="Description"
                multiline
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                fullWidth
                disabled={saving}
              />
            </Grid>

            <Grid container size={{ xs: 6 }}>
              <TextField
                label="Price"
                type="number"
                value={price ?? ""}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? undefined : +e.target.value)
                }
                fullWidth
                required
                disabled={saving}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            <Grid container size={{ xs: 6 }}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity ?? ""}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
                fullWidth
                disabled={saving}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                fullWidth
                value={categories}
                onChange={(_, v) => setCategories(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" fullWidth />
                )}
                disabled={saving}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <TextField
                label="Auction End Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={auctionEnd}
                onChangeCapture={handleOnEndDateChange}
                fullWidth
                disabled={saving}
                error={auctionEnd && new Date(auctionEnd) <= new Date() && !!saveError}
                helperText={auctionEnd && new Date(auctionEnd) <= new Date() && !!saveError ? "The product's auction date needs to be set in the future" : "Leave empty for regular product"}
              />
            </Grid>

            {saveError && (
              <Grid container size={{ xs: 12 }}>
                <Alert severity="error" variant="outlined">
                  {saveError}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={isSaveDisabled}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductDialog;

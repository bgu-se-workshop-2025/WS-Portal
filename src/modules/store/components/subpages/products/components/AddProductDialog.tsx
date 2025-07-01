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

interface AddProductDialogProps {
  open: boolean;
  storeId: string;
  onClose: () => void;
  onProductAdded: () => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  storeId,
  onClose,
  onProductAdded,
}) => {
  const theme = useTheme();

  // Form state (all fields used for creating a ProductDto)
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
  const [newQuantity, setNewQuantity] = useState<number | undefined>(undefined);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [newAuctionEnd, setNewAuctionEnd] = useState(""); // ISO datetime
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string>();

  useEffect(() => {
    if (!open) {
      // Reset form when the dialog is closed
      setNewName("");
      setNewDesc("");
      setNewPrice(undefined);
      setNewQuantity(undefined);
      setNewCategories([]);
      setNewAuctionEnd("");
      setAddError(undefined);
      setAdding(false);
    }
  }, [open]);

  const handleAdd = async () => {
    // Client-side validation
    if (!newName.trim()) {
      setAddError("Product name is required");
      return;
    }
    
    if (newPrice === undefined || newPrice <= 0) {
      setAddError("Product price must be greater than zero");
      return;
    }

    if (newQuantity !== undefined && newQuantity < 0) {
      setAddError("Product quantity cannot be negative");
      return;
    }

    // Validate auction date if provided
    if (newAuctionEnd) {
      const auctionDate = new Date(newAuctionEnd);
      const now = new Date();
      if (auctionDate <= now) {
        setAddError("The product's auction date needs to be set in the future");
        return;
      }
    }

    setAdding(true);
    setAddError(undefined);

    try {
      // Convert auction date to backend format if provided
      let formattedAuctionDate: string | undefined = undefined;
      if (newAuctionEnd) {
        const date = new Date(newAuctionEnd);
        // Format as "HH:mm:ss dd/MM/yyyy" to match backend expectation
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = '00';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        formattedAuctionDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
      }

      const toCreate: Partial<ProductDto> = {
        name: newName.trim(),
        description: newDesc.trim(),
        price: newPrice,
        quantity: newQuantity ?? 0,
        categories: newCategories.length > 0 ? newCategories : [],
        auctionEndDate: formattedAuctionDate,
      };

      await sdk.createProduct(storeId, toCreate as ProductDto);

      // Close dialog and refresh parent
      onClose();
      onProductAdded();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setAddError(err.userFriendlyMessage || err.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };
  
  const handleOnEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewAuctionEnd(new Date(value).toISOString());
  };

  const isAddDisabled =
    adding || newName.trim().length === 0 || newPrice === undefined;

  return (
    <Dialog open={open} onClose={adding ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Product
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
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                fullWidth
                required
                disabled={adding}
                error={!newName.trim() && !!addError}
                helperText={!newName.trim() && !!addError ? "Product name is required" : ""}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <TextField
                label="Description"
                multiline
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                fullWidth
                disabled={adding}
              />
            </Grid>

            <Grid container size={{ xs: 6 }}>
              <TextField
                label="Price"
                type="number"
                value={newPrice ?? ""}
                onChange={(e) =>
                  setNewPrice(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
                fullWidth
                required
                disabled={adding}
                error={(newPrice !== undefined && newPrice <= 0) && !!addError}
                helperText={(newPrice !== undefined && newPrice <= 0) && !!addError ? "Price must be greater than 0" : ""}
                InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
              />
            </Grid>

            <Grid container size={{ xs: 6 }}>
              <TextField
                label="Quantity"
                type="number"
                value={newQuantity ?? ""}
                onChange={(e) =>
                  setNewQuantity(
                    e.target.value === "" ? undefined : +e.target.value
                  )
                }
                fullWidth
                disabled={adding}
                error={(newQuantity !== undefined && newQuantity < 0) && !!addError}
                helperText={(newQuantity !== undefined && newQuantity < 0) && !!addError ? "Quantity cannot be negative" : ""}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                fullWidth
                value={newCategories}
                onChange={(_, v) => setNewCategories(v)}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" fullWidth />
                )}
                disabled={adding}
              />
            </Grid>

            <Grid container size={{ xs: 12 }}>
              <TextField
                label="Auction End Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={newAuctionEnd}
                onChangeCapture={handleOnEndDateChange}
                fullWidth
                disabled={adding}
                error={newAuctionEnd && new Date(newAuctionEnd) <= new Date() && !!addError}
                helperText={newAuctionEnd && new Date(newAuctionEnd) <= new Date() && !!addError ? "The product's auction date needs to be set in the future" : "Leave empty for regular product"}
              />
            </Grid>

            {addError && (
              <Grid container size={{ xs: 12 }}>
                <Alert severity="error" variant="outlined">
                  {addError}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: theme.spacing(3), pb: theme.spacing(2) }}>
        <Button onClick={onClose} disabled={adding}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={adding || !newName.trim() || newPrice === undefined || newPrice <= 0}
        >
          {adding ? "Adding…" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;

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
    if (newName.trim().length === 0 || newPrice === undefined) {
      return;
    }

    setAdding(true);
    setAddError(undefined);

    try {
      const toCreate: Partial<ProductDto> = {
        name: newName.trim(),
        description: newDesc.trim(),
        price: newPrice,
        quantity: newQuantity ?? 0,
        categories: newCategories,
        auctionEndDate: newAuctionEnd,
      };

      await sdk.createProduct(storeId, toCreate as ProductDto);

      // notify parent to refresh page 0 & refetch
      onProductAdded();
    } catch (err: any) {
      console.error("Error adding product:", err);
      setAddError(err.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };
  
  const handleOnEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewAuctionEnd(value);
  };

  const isAddDisabled =
    adding || newName.trim().length === 0 || newPrice === undefined;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
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
                onChange={handleOnEndDateChange}
                fullWidth
                disabled={adding}
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
          disabled={isAddDisabled}
        >
          {adding ? "Adding…" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { StoreDto } from "../../../../shared/types/dtos";
import { useAdminResponse } from "../hooks/useAdmin";

interface StoresTableProps {
  useAdminResponse: useAdminResponse;
}

const StoresTable: React.FC<StoresTableProps> = ({ useAdminResponse }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<StoreDto | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    // Load stores when component mounts
    useAdminResponse.getStores(0, 25).catch(console.error);
  }, []);

  const handleDeleteClick = (store: StoreDto) => {
    setStoreToDelete(store);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;

    try {
      await useAdminResponse.deleteStore(storeToDelete.id!);
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete store");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStoreToDelete(null);
    setDeleteError(null);
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Store Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Store Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {useAdminResponse.stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick(store)}
                    disabled={useAdminResponse.loading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {useAdminResponse.stores.length === 0 && !useAdminResponse.loading && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No stores found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Store</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete the store "{storeToDelete?.name}"? 
            This action cannot be undone and will permanently remove the store and all its data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={useAdminResponse.loading}
          >
            {useAdminResponse.loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoresTable; 
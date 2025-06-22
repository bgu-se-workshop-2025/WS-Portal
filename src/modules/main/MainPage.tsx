import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { StoreDto } from "../../shared/types/dtos";
import { isAuthenticated, sdk } from "../../sdk/sdk";

const PAGE_SIZE = 12;

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState<StoreDto[]>([]);
  const [page, setPage] = useState<number>(0);

  const [addedStores, setAddedStores] = useState<number>(0);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const pageable = {
          page: page,
          size: PAGE_SIZE,
        };
        const data = await sdk.getStores(pageable);
        setStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, [page, addedStores]);

  const storeList = useCallback(
    () =>
      stores.map((store) => (
        <Box
          key={store.id}
          onClick={() => navigate(`/store/${store.id}`)}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            height: "8rem",
            backgroundColor: "background.paper",
            boxShadow: 1,
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 4,
            },
            "&:active": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            {store.name}
          </Typography>
          <Typography variant="body2">{store.description}</Typography>
        </Box>
      )),
    [stores]
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => {
    setDialogOpen(false);
    setNewName("");
    setNewDesc("");
  };

  const handleSave = async () => {
    const newStore: StoreDto = {
      id: undefined,
      name: newName,
      description: newDesc,
      rating: 0,
    };
    await sdk.createStore(newStore);
    closeDialog();

    setAddedStores((prev) => prev + 1);
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: `calc(100vh - 8rem)`,
        p: 4,
      }}
    >
      <Box
        component="section"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
          justifyContent: "start",
        }}
      >
        {storeList()}
      </Box>

      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Previous
          </Button>
          <Typography>Page {page + 1}</Typography>
          <Button
            variant="outlined"
            disabled={stores.length < PAGE_SIZE}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Box>

        {isAuthenticated() &&
          <Box sx={{ textAlign: "center" }}>
            <Button variant="contained" onClick={openDialog}>
              Add Store
            </Button>
          </Box>
        }
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!newName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPage;

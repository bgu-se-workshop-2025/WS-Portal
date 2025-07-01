import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { sdk } from "../../../../sdk/sdk";
import type { StoreDto, SellerDto } from "../../../../shared/types/dtos";

const StoreSettings: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isCreator, setIsCreator] = useState(false);

  // Check if current user is the store creator
  useEffect(() => {
    const checkIfCreator = async () => {
      if (!storeId) return;

      try {
        // Get current user information
        const currentUser = await sdk.getCurrentUserProfileDetails();

        // Get current user's seller information for this store
        const sellerInfo: SellerDto = await sdk.getSeller(storeId, currentUser.id);
        
        // The creator is the seller who has no employer (employerSellerId is empty or equals their own id)
        // or the seller who is their own employer (root of the seller hierarchy)
        const isStoreCreator = !sellerInfo.employerSellerId || 
                              sellerInfo.employerSellerId === sellerInfo.id ||
                              sellerInfo.employerSellerId === currentUser.id;
        
        setIsCreator(isStoreCreator);
      } catch {
        console.log("User is not a seller of this store or error checking creator status");
        setIsCreator(false);
      }
    };

    checkIfCreator();
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    sdk
      .getStore(storeId)
      .then(setStore)
      .catch(() =>
        setMessage({ type: "error", text: "Failed to load store." })
      );
  }, [storeId]);

  const handleUpdate = useCallback(async () => {
    if (!store) return;
    setLoading(true);
    setMessage(null);
    try {
      const updated = await sdk.updateStore(storeId!, store);
      setStore(updated);
      setMessage({ type: "success", text: "Store updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to update store." });
    } finally {
      setLoading(false);
    }
  }, [store, storeId]);

  const handleClose = useCallback(async () => {
    if (!storeId) return;
    if (!window.confirm("Are you sure you want to close this store? This action cannot be undone.")) return;
    setLoading(true);
    setMessage(null);
    try {
      await sdk.closeStore(storeId);
      setMessage({ type: "success", text: "Store closed successfully." });
      // Navigate away after a short delay to show success message
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch {
      setMessage({ type: "error", text: "Failed to close store." });
    } finally {
      setLoading(false);
    }
  }, [storeId, navigate]);

  if (!storeId) return null;

  return (
    <Box display="flex" justifyContent="center" mt={4} width="100%">
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={store?.name ?? ""}
              onChange={(e) =>
                store && setStore({ ...store, name: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={store?.description ?? ""}
              onChange={(e) =>
                store && setStore({ ...store, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
            />
            {message && <Alert severity={message.type}>{message.text}</Alert>}
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading || !store?.name.trim()}
          >
            {loading ? "Saving…" : "Save"}
          </Button>
          {isCreator && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              disabled={loading}
            >
              Close Store
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default StoreSettings;

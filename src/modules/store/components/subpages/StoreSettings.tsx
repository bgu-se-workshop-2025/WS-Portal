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
import type { StoreDto } from "../../../../shared/types/dtos";

const StoreSettings: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const [store, setStore] = useState<StoreDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
    } catch (err) {
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
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            disabled={loading}
          >
            Close Store
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default StoreSettings;

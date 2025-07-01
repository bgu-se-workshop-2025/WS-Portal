import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { sdk } from "../../../../sdk/sdk";
import { StoreDto } from "../../../../shared/types/dtos";

const StoreSettings = () => {
  const { storeId } = useParams();
  if (!storeId) return null;

  const [store, setStore] = useState<StoreDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    sdk
      .getStore(storeId)
      .then((data: StoreDto) => setStore(data))
      .catch((err) => {
        console.error("Failed to load store:", err);
        setErrorMsg("Failed to load store from the backend.");
      });
  }, [storeId]);

  const handleUpdate = async () => {
    if (!store) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updated = await sdk.updateStore(storeId, {
        id: storeId,
        name: store.name,
        description: store.description,
        rating: store.rating,
      });
      setStore(updated);
      setSuccessMsg("✅ Store updated successfully.");
    } catch (err: any) {
      setErrorMsg(err.message || "❌ Failed to update store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, width: "100%", maxWidth: 600 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          color="primary"
          mb={3}
          display="flex"
          alignItems="center"
          gap={1}
        >
          ⚙️ Store Settings
        </Typography>

        {!store ? (
          <Typography color="text.secondary">Loading store details...</Typography>
        ) : (
          <Stack spacing={3}>
            <TextField
              label="Store Name"
              value={store.name}
              onChange={(e) =>
                setStore({ ...store, name: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={store.description}
              onChange={(e) =>
                setStore({ ...store, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
            />

            {errorMsg && (
              <Typography color="error" fontSize={14}>
                {errorMsg}
              </Typography>
            )}
            {successMsg && (
              <Typography color="green" fontSize={14}>
                {successMsg}
              </Typography>
            )}

            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleUpdate}
                disabled={loading || !store.name.trim()}
                sx={{ minWidth: 200, height: 45 }}
              >
                {loading ? "Updating..." : "Update Store"}
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default StoreSettings;

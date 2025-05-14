import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { sdk } from "../../../../sdk/sdk";
import { StoreDto } from "../../../../shared/types/dtos";

const StoreSettings: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const [store, setStore] = useState<StoreDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!storeId) return;

    sdk
      .getStore(storeId)
      .then((data: StoreDto) => {
        setStore(data);
      })
      .catch((err) => {
        console.error("Failed to load store:", err);
        setErrorMsg("Failed to load store from the backend.");
      });
  }, [storeId]);

  const handleUpdate = async () => {
    if (!storeId || !store) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updated = await sdk.updateStore(storeId, {
        id: storeId,
        name: store.name,
        description: store.description,
      });
      setStore(updated);
      setSuccessMsg("Store updated successfully.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2} maxWidth={600} sx={{ width: "30rem" }} alignItems="center">
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

      {errorMsg ? (
        <Typography color="error.main">{errorMsg}</Typography>
      ) : !store ? (
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

          {/* Reserve space for status messages */}
          <Box height={30} display="flex" alignItems="center">
            {successMsg && (
              <Typography color="success.main">{successMsg}</Typography>
            )}
          </Box>

          {/* Fixed button size to prevent shrinking */}
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading || !store.name.trim()}
            sx={{ minWidth: 160, height: 40 }}
          >
            {loading ? "Updating..." : "Update Store"}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default StoreSettings;

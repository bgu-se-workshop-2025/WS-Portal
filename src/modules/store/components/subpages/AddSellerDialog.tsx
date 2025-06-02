import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { sdk } from "../../../../sdk/sdk";
import { SellerType } from "../../../../shared/types/dtos"; 

type PermissionObject = Record<string, boolean>; // 🔹 Dynamic permissions

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  employerSellerId: string;
  onSuccess: (newSeller: {
    id: string;
    name: string;
    role: string;
    isYou?: boolean;
    permissions: PermissionObject;
  }) => void;
}

const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  [SellerType.OWNER]: "Owner",
  [SellerType.MANAGER]: "Manager",
  [SellerType.UNKNOWN]: "Unknown",
};


const formatLabel = (label: string): string =>
  label
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const AddSellerDialog: React.FC<Props> = ({
  open,
  onClose,
  storeId,
  employerSellerId,
  onSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
const [sellerType, setSellerType] = useState<SellerType>(SellerType.MANAGER);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 useEffect must not be async directly
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const perms = await sdk.getStorePermissions();
        setAllPermissions(perms);
      } catch (e) {
        console.error("Failed to fetch permissions. Using fallback." , e);
      }
    };

    fetchPermissions();
    setPermissions([]);
  }, []);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const handleAdd = async () => {
    setError(null);

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    setLoading(true);
    try {
      const user = await sdk.getPublicUserProfileDetailsByUsername(username.trim());
      console.log("Fetched user:", user);
      await sdk.addSeller(storeId, user.id,{
        userId: user.id,
        storeId,
        sellerType,
        employerSellerId,
        permissions,
      });


      const permissionObject: PermissionObject = {};
      allPermissions.forEach((perm) => {
        permissionObject[perm] = permissions.includes(perm);
      });

      onSuccess({
        id: user.id,
        name: user.username,
        role: SELLER_TYPE_LABELS[sellerType],
        permissions: permissionObject,
        isYou: user.id === employerSellerId,
      });

      setUsername("");
      setSellerType(SellerType.MANAGER);
      setPermissions([]);
      onClose();
    } catch (err: any) {
      let msg = "An unknown error occurred.";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (typeof err === "string") {
        msg = err;
      } else if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === "object" && err?.message) {
        msg = err.message;
      }

      setError(msg);
      console.error("Failed to add seller:", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Seller</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          error={!username.trim()}
          helperText={!username.trim() ? "Required" : ""}
        />

              <TextField
        select
        label="Seller Role"
        value={sellerType}
        onChange={(e) => setSellerType(e.target.value as SellerType)}
        fullWidth
      >
        {Object.entries(SELLER_TYPE_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>


        <Box mt={3} mb={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Access Permissions
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <FormGroup>
            {allPermissions.map((perm) => (
              <FormControlLabel
                key={perm}
                control={
                  <Checkbox
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                }
                label={formatLabel(perm)}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!username.trim() || loading}
        >
          {loading ? "Adding…" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSellerDialog;

import React, { useState } from "react";
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

// Permissions enum and types
const ALL_PERMISSIONS = [
  "CanAddDiscount",
  "CanRemoveProduct",
  "CanAddProduct",
  "CanModifyPermissions",
] as const;

type Perm = typeof ALL_PERMISSIONS[number];

type PermissionObject = {
  CanAddDiscount: boolean;
  CanRemoveProduct: boolean;
  CanAddProduct: boolean;
  CanModifyPermissions: boolean;
};

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

const SELLER_TYPE_LABELS: Record<0 | 1 | 2, string> = {
  0: "Owner",
  1: "Manager",
  2: "Unknown",
};

const formatLabel = (label: string): string =>
  label
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

const AddSellerDialog: React.FC<Props> = ({
  open,
  onClose,
  storeId,
  employerSellerId,
  onSuccess,
}) => {
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [sellerType, setSellerType] = useState<0 | 1 | 2>(1);
  const [permissions, setPermissions] = useState<Perm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePermission = (perm: Perm) => {
    setPermissions((prev) =>
      prev.includes(perm)
        ? (prev.filter((p) => p !== perm) as Perm[])
        : ([...prev, perm] as Perm[])
    );
  };

  const handleAdd = async () => {
    setError(null);
    if (!id.trim() || !userId.trim()) {
      setError("Record ID and User ID are required.");
      return;
    }

    setLoading(true);
    try {
      await sdk.addSeller(storeId, {
        id: id.trim(),
        userId: userId.trim(),
        storeId,
        sellerType,
        employerSellerId: employerSellerId.trim(),
        permissions,
      });

      const permissionObject: PermissionObject = {
        CanAddDiscount: false,
        CanRemoveProduct: false,
        CanAddProduct: false,
        CanModifyPermissions: false,
      };
      permissions.forEach((p) => {
        permissionObject[p] = true;
      });

      onSuccess({
        id: id.trim(),
        name: userId.trim(), // simulate display name
        role: SELLER_TYPE_LABELS[sellerType],
        permissions: permissionObject,
        isYou: false,
      });

      setId("");
      setUserId("");
      setSellerType(1);
      setPermissions([]);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Failed to add seller:", err.message);
      } else {
        setError("An unknown error occurred.");
        console.error("Failed to add seller:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Seller</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {error && <Typography color="error">{error}</Typography>}

        <TextField
          label="Record ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          fullWidth
          error={!id.trim()}
          helperText={!id.trim() ? "Required" : ""}
        />

        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          fullWidth
          error={!userId.trim()}
          helperText={!userId.trim() ? "Required" : ""}
        />

        <TextField
          select
          label="Seller Role"
          value={sellerType}
          onChange={(e) => setSellerType(Number(e.target.value) as 0 | 1 | 2)}
          fullWidth
        >
          {Object.entries(SELLER_TYPE_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={Number(value)}>
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
            {ALL_PERMISSIONS.map((perm) => (
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
          disabled={!id.trim() || !userId.trim() || loading}
        >
          {loading ? "Adding…" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSellerDialog;

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
import ErrorDisplay from "../../../../shared/components/ErrorDisplay";
import { useErrorHandler } from "../../../../shared/hooks/useErrorHandler";
import { ErrorContext } from "../../../../shared/types/errors";

type PermissionObject = Record<string, boolean>;

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  employerSellerId: string;
  onSuccess: (newSeller: {
    userId: string;
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
  
  const { error, setError, clearError, withErrorHandling } = useErrorHandler();

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
    clearError();

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (permissions.length === 0) {
      setError("At least one permission must be selected.");
      return;
    }

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'addSeller',
      additionalInfo: {
        storeId,
        username: username.trim(),
        sellerType: sellerType.toString()
      }
    };

    await withErrorHandling(async () => {
      const user = await sdk.getPublicUserProfileDetailsByUsername(username.trim(), context);
      console.log("Fetched user:", user);
      console.log("🟢 Adding seller with:");
      console.log("  sellerType =", sellerType);
      console.log("  typeof sellerType =", typeof sellerType);
      console.log("  full payload =", {
        userId: user.id,
        storeId,
        sellerType,
        employerSellerId,
        permissions,
      });
      
      await sdk.addSeller(storeId, user.id, {
        userId: user.id,
        storeId,
        type: sellerType,
        employerSellerId,
        permissions,
      });

      const permissionObject: PermissionObject = {};
      allPermissions.forEach((perm) => {
        permissionObject[perm] = permissions.includes(perm);
      });

      onSuccess({
        userId: user.id,
        name: user.username,
        role: SELLER_TYPE_LABELS[sellerType],
        permissions: permissionObject,
        isYou: user.id === employerSellerId,
      });

      setUsername("");
      setSellerType(SellerType.MANAGER);
      setPermissions([]);
      onClose();
    }, context);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Seller</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {error && (
          <ErrorDisplay
            error={error}
            variant="alert"
            onClose={clearError}
            showRetry={false}
          />
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
          onChange={(e) => setSellerType(Number(e.target.value) as SellerType)} 
          fullWidth
        >
          {[SellerType.OWNER, SellerType.MANAGER, SellerType.UNKNOWN].map((type) => (
            <MenuItem key={type} value={type}>
              {SELLER_TYPE_LABELS[type]}
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

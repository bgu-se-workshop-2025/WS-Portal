import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
  Paper,
  Stack,
} from "@mui/material";

type PermissionObject = Record<string, boolean>;

interface Props {
  open: boolean;
  sellerName: string;
  permissions: PermissionObject;
  canEdit: boolean;
  onClose: () => void;
  onSave: (updated: PermissionObject) => void;
}

const formatLabel = (label: string): string =>
  label
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

const SellerPermissionsDialog: React.FC<Props> = ({
  open,
  sellerName,
  permissions,
  canEdit,
  onClose,
  onSave,
}) => {
  const [editedPermissions, setEditedPermissions] = useState<PermissionObject>({});

  useEffect(() => {
    setEditedPermissions(permissions);
  }, [permissions]);

  const togglePermission = (perm: string) => {
    if (!canEdit) return;
    setEditedPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6">@{sellerName}'s Permissions</Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {Object.entries(editedPermissions).map(([perm, value]) => (
            <Paper
              key={perm}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                backgroundColor: "rgba(102, 102, 204, 0.6)",
              }}
              elevation={2}
            >
             <Typography fontWeight={600} color="white">
              {formatLabel(perm)}
              </Typography>

              <Switch
                checked={value}
                onChange={() => togglePermission(perm)}
                disabled={!canEdit}
              />
            </Paper>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSave(editedPermissions);
            onClose();
          }}
          disabled={!canEdit}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellerPermissionsDialog;

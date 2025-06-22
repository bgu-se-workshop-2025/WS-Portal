import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import SellerCard from "./SellerCard";
import SellerPermissionsDialog from "./SellerPermissionsDialog";
import AddSellerDialog from "./AddSellerDialog";
import RemoveSellerDialog from "./RemoveSellerDialog";
import { sdk } from "../../../../sdk/sdk";
import {
  PublicUserDto,
  SellerDto,
} from "../../../../shared/types/dtos";
import ErrorDisplay from "../../../../shared/components/ErrorDisplay";
import { useErrorHandler } from "../../../../shared/hooks/useErrorHandler";
import { withErrorHandling } from "../../../../shared/utils/errorHandler";
import { ErrorHandler } from "../../../../shared/utils/errorHandler";
import { ErrorContext } from "../../../../shared/types/errors";

type PermissionObject = Record<string, boolean>;

interface Seller {
  userId: string;
  name: string;
  role: string;
  isYou?: boolean;
  permissions: PermissionObject;
}

const StoreSellers = () => {
  const { storeId } = useParams();
	if (!storeId) return;

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [permDialogOpen, setPermDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedSellerToRemove, setSelectedSellerToRemove] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [allPermissions, setAllPermissions] = useState<string[]>([]); 

  const { error, setError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await sdk.getCurrentUserProfileDetails();
        setCurrentUserId(user?.id || "");
      } catch (err) {
        console.error("Failed to get current user ", err);
        setCurrentUserId("");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    sdk.getStorePermissions()
      .then(setAllPermissions)
      .catch((err) => {
        console.error("Failed to fetch store permissions ", err);
        setAllPermissions([]);
      });
  }, []);

  const fetchSellers = async () => {
    if (!storeId) {
      setSellers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearError();

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'fetchSellers',
      additionalInfo: { storeId }
    };

    await withErrorHandling(async () => {
      const officials: PublicUserDto[] = await sdk.getStoreOfficials(storeId);
      const detailedSellers: Seller[] = (
        await Promise.all(
          officials.map(async (u) => {
            try {
              const sellerDto: SellerDto = await sdk.getSeller(storeId, u.id);
              const roleName = sellerDto.type.toString() ?? "Unknown";

              const permsObj: PermissionObject = {};
              (sellerDto.permissions || []).forEach((perm) => {
                permsObj[perm] = true;
              });

              return {
                userId: u.id,
                name: u.username,
                role: roleName,
                isYou: u.id === currentUserId,
                permissions: permsObj,
              };
            } catch (innerErr) {
              console.error(`Failed to fetch seller data for ${u.id} `, innerErr);
              return { userId: "", name: "", role: "", isYou: false, permissions: {} };
            }
          })
        )
      ).filter((s) => s.userId !== "");

      setSellers(detailedSellers);
      setLoading(false);
    }, context, (error) => {
      setError(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSellers();
  }, [storeId, currentUserId]);

  const handleOpenPerms = (seller: Seller) => {
    setSelectedSeller(seller);
    setPermDialogOpen(true);
  };

  const handleClosePerms = () => {
    setPermDialogOpen(false);
    setSelectedSeller(null);
  };

  const handleSavePerms = async (newPerms: PermissionObject) => {
    if (!selectedSeller || !storeId) return;

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'updatePermissions',
      additionalInfo: { 
        storeId, 
        sellerId: selectedSeller.userId,
        sellerName: selectedSeller.name
      }
    };

    await withErrorHandling(async () => {
      const updatedPermissions: string[] = Object.entries(newPerms)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([perm]) => perm);

      const sellerDto = await sdk.getSeller(storeId, selectedSeller.userId);
      const sellerId = sellerDto.id;

      if (!sellerId) throw new Error("Seller ID not found.");

      await sdk.updateManagerPermissions(storeId, sellerId, updatedPermissions);

      setSellers((prev) =>
        prev.map((s) =>
          s.userId === selectedSeller.userId
            ? { ...s, permissions: newPerms }
            : s
        )
      );
    }, context, (error) => {
      setError(error);
    });
  };

  const handleAddSuccess = (newSeller: Seller) => {
    setSellers((prev) => [...prev, newSeller]);
    setAddDialogOpen(false);
  };

  const handleDeleteSellerClick = (seller: Seller) => {
    setSelectedSellerToRemove(seller);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedSellerToRemove || !storeId) return;

    const context: ErrorContext = {
      component: 'StoreModule',
      action: 'removeSeller',
      additionalInfo: { 
        storeId, 
        sellerId: selectedSellerToRemove.userId,
        sellerName: selectedSellerToRemove.name
      }
    };

    await withErrorHandling(async () => {
      const sellerDto = await sdk.getSeller(storeId, selectedSellerToRemove.userId);
      const sellerId = sellerDto.id;
      if (!sellerId) throw new Error("Seller ID could not be determined for removal.");

      await sdk.removeSeller(storeId, sellerId);
      setSellers((prev) => prev.filter((s) => s.userId !== selectedSellerToRemove.userId));
    }, context, (error) => {
      setError(error);
    });
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" mb={2}>👥 Store Sellers</Typography>

      <Button variant="contained" onClick={() => setAddDialogOpen(true)} sx={{ mb: 3 }}>
        Add Seller
      </Button>

      {error && (
        <ErrorDisplay
          error={error}
          variant="alert"
          onClose={clearError}
          showRetry={true}
          onRetry={fetchSellers}
        />
      )}

      <Stack spacing={2} width="100%" maxWidth="500px">
        {!loading && !error && sellers.map((seller) => (
          <SellerCard
            key={seller.userId}
            name={seller.name}
            role={seller.role}
            isYou={seller.isYou}
            onSettingsClick={() => handleOpenPerms(seller)}
            onDeleteClick={() => handleDeleteSellerClick(seller)}
          />
        ))}
        {!loading && !error && sellers.length === 0 && (
          <Typography color="textSecondary" align="center">
            No sellers yet for this store.
          </Typography>
        )}
        {loading && <Typography align="center">Loading sellers…</Typography>}
      </Stack>

      {storeId && (
        <AddSellerDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          storeId={storeId}
          employerSellerId={currentUserId}
          onSuccess={handleAddSuccess}
        />
      )}
      {selectedSeller && (
        <SellerPermissionsDialog
          open={permDialogOpen}
          sellerName={selectedSeller.name}
          permissions={selectedSeller.permissions}
          allPermissions={allPermissions}
          canEdit={!selectedSeller.isYou}
          isOwner={selectedSeller.role === "OWNER"}
          onClose={handleClosePerms}
          onSave={handleSavePerms}
        />
      )}
      <RemoveSellerDialog
        open={removeDialogOpen}
        sellerName={selectedSellerToRemove?.name || ""}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={handleConfirmRemove}
      />
    </Box>
  );
};

export default StoreSellers;

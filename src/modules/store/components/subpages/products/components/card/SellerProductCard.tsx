import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  useTheme,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { ProductDto } from "../../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../../sdk/sdk";
import UpdateProductDialog from "../UpdateProductDialog";

interface SellerProductCardProps {
  product: ProductDto;
  setUpdateProducts: React.Dispatch<React.SetStateAction<boolean>>;
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({ product, setUpdateProducts }) => {
  const theme = useTheme();
  const { storeId } = useParams<{ storeId: string }>();

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  if (!storeId) {
    return null; // or show an error
  }

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(undefined);

    try {
      await sdk.deleteProduct(storeId, product.id);
        setUpdateProducts((value) => !value);
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setDeleteError(err.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEdit = () => {
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleProductUpdated = () => {
    setEditOpen(false);
    setUpdateProducts((value) => !value);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[1],
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom noWrap sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            paragraph
            noWrap
            sx={{ color: theme.palette.text.secondary }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mb: theme.spacing(1) }}>
            <Typography variant="body2">
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body2">
              <strong>Available:</strong> {product.quantity}
            </Typography>
          </Box>

          {product.rating > 0 && (
            <Typography variant="body2">
              <strong>Rating:</strong> {product.rating.toFixed(1)}
            </Typography>
          )}

          {product.categories.length > 0 && (
            <Typography variant="body2">
              <strong>Categories:</strong> {product.categories.join(", ")}
            </Typography>
          )}
          {product.auctionEndDate && (
            <Typography variant="body2" sx={{ mt: theme.spacing(1) }}>
              <strong>Auction Ends:</strong>{" "}
              {new Date(product.auctionEndDate).toLocaleString()}
            </Typography>
          )}

          {deleteError && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: theme.spacing(1), display: "block" }}
            >
              {deleteError}
            </Typography>
          )}
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
            px: theme.spacing(2),
            pb: theme.spacing(2),
          }}
        >
          <Button
            size="small"
            startIcon={<Add />}
            onClick={handleOpenEdit}
            disabled={deleting}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </CardActions>
      </Card>

      {/* Update Dialog */}
      <UpdateProductDialog
        open={editOpen}
        storeId={storeId}
        existingProduct={product}
        onClose={handleCloseEdit}
        onProductUpdated={handleProductUpdated}
      />
    </>
  );
};

export default SellerProductCard;

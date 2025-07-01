import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import {
  ProductDto,
} from "../../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../../sdk/sdk";
import { useNavigate } from "react-router-dom";


const AuctionProductCard: React.FC<{
  product: ProductDto;
  setUpdateProducts?: React.Dispatch<React.SetStateAction<boolean>>;
  isUserAuthenticated: boolean;
}> = ({ product, isUserAuthenticated }) => {
  const [currentTopOffer, setCurrentTopOffer] = useState<number | null>(null);
  const [bidValue, setBidValue] = useState<string>("");
  const [bidError, setBidError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk
        .getWinningBidPrice(product.id)
        .then(setCurrentTopOffer)
        .catch(() => setCurrentTopOffer(null));
    }
  }, [product.auctionEndDate, product.id]);

  const handleAddOfferClick = () => {
    setBidError(null);
    if (currentTopOffer) {
      if (Number(bidValue) > currentTopOffer) {
        navigate(`/payment/${product.id}/${bidValue}`, { replace: true });
      } else {
        setBidError("Offer must be higher than current top offer");
      }
    } else{
      if (Number(bidValue) >= product.price) {
        navigate(`/payment/${product.id}/${bidValue}`, { replace: true });
      } else {
        setBidError("Offer must be at least the starting price");
      }
    }
  };

    return (
      <Box>
        <Box sx={{ mb: 1 }}>
        <Typography variant="body2">
          <strong>Current Top Offer:</strong>{" "}
          {currentTopOffer !== null
            ? `$${currentTopOffer.toFixed(2)}`
            : "No bids yet"}
        </Typography>
        <Typography variant="body2">
          <strong>Starting Price:</strong> ${product.price.toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        {isUserAuthenticated && (
          <TextField
            size="small"
            label="Your Offer"
            type="number"
            value={bidValue}
            onChange={(e) => setBidValue(e.target.value)}
            sx={{ mr: 1, width: 120 }}
          />
        )}
        {isUserAuthenticated ? (
            <Button
                size="small"
                variant="contained"
                onClick={handleAddOfferClick}
            >
                Add Offer
            </Button>)
        : (
          <Typography variant="body2" color="text.secondary">
            Please log in to place a bid.
          </Typography>
        )}
      </Box>
      
        <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Auction Ends:</strong>{" "}
            {new Date(product.auctionEndDate!).toLocaleString()}
        </Typography>
      {bidError && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {bidError}
        </Typography>
      )}

    </Box>
  );
};

export default AuctionProductCard;
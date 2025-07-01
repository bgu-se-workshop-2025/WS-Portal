import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";
import { ProductDto, AuctionBidDto } from "../../../../../../../shared/types/dtos";
import { sdk } from "../../../../../../../sdk/sdk";

interface SellerAuctionProductCardProps {
  product: ProductDto;
}

const SellerAuctionProductCard: React.FC<SellerAuctionProductCardProps> = ({ product }) => {
  const [currentTopOffer, setCurrentTopOffer] = useState<number | null>(null);
  const [bidHistoryOpen, setBidHistoryOpen] = useState(false);
  const [bidHistory, setBidHistory] = useState<AuctionBidDto[]>([]);
  const [bidderMap, setBidderMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product.auctionEndDate) {
      sdk.getWinningBidPrice(product.id)
        .then(setCurrentTopOffer)
        .catch(() => setCurrentTopOffer(null));
    }
  }, [product.auctionEndDate, product.id]);

  const handleOpenBidHistory = async () => {
    setLoading(true);
    setBidHistoryOpen(true);
    try {
      const pageable = { page: 0, size: 25 };
      const bids = await sdk.getBids(product.id, pageable);
      setBidHistory([...bids].sort((a, b) => b.bidPrice - a.bidPrice));

      const uniqueIds = Array.from(new Set(bids.map(b => b.bidderId)));
      const entries = await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const user = await sdk.getPublicUserProfileDetails(id);
            return [id, user.username || id];
          } catch {
            return [id, id];
          }
        })
      );
      setBidderMap(Object.fromEntries(entries));
    } catch {
      setBidHistory([]);
      setBidderMap({});
    } finally {
      setLoading(false);
    }
  };
  return (
      <Box>
          <Typography variant="body2">
            <strong>Starting Price:</strong> ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            <strong>Current Top Bid:</strong>{" "}
            {currentTopOffer !== null ? `$${currentTopOffer.toFixed(2)}` : "No bids yet"}
          </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleOpenBidHistory}
        >
          View Bid History
        </Button>
        
        <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Auction Ends:</strong>{" "}
            {new Date(product.auctionEndDate!).toLocaleString()}
        </Typography>
        
      <Dialog open={bidHistoryOpen} onClose={() => setBidHistoryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bid History</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Bidder
                  </TableCell>
                  <TableCell>
                    Bid Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bidHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No bids yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  bidHistory.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>
                        {bidderMap[bid.bidderId] || bid.bidderId}
                      </TableCell>
                      <TableCell>
                        ${bid.bidPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerAuctionProductCard;
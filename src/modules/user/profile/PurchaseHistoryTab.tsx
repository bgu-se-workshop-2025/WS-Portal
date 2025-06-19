import React from "react";
import { UserProfileTabProps } from "./UserProfileTabs";
import { Box, Typography, CircularProgress, Alert, List, ListItem, Button, Divider } from "@mui/material";
import RatingComponent from '../../../shared/components/RatingComponent';
import { sdk } from '../../../sdk/sdk';

const PAGE_SIZE = 25;

const PurchaseHistoryTab: React.FC<UserProfileTabProps> = ({ orders, ordersLoading, ordersError, cartSnapshots, liveStoreNames, setOrders, setLiveStoreNames }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#58a6ff', fontSize: { xs: 20, sm: 24 } }}>
        Purchase History
      </Typography>
      {ordersLoading ? (
        <Box display="flex" justifyContent="center" py={2}><CircularProgress size={28} /></Box>
      ) : ordersError ? (
        <Alert severity="error">{ordersError}</Alert>
      ) : orders.length === 0 ? (
        <Typography color="text.secondary">No purchases found.</Typography>
      ) : (
        <List sx={{ width: '100%', p: 0, maxWidth: { xs: '100%', sm: 700, md: 900 }, minWidth: 0, mx: 'auto' }}>
          {orders.map((order) => {
            const cartSnapshot = order.cartSnapshot && cartSnapshots[order.cartSnapshot];
            return (
              <ListItem
                key={order.id}
                sx={{
                  borderRadius: 3,
                  mb: 3,
                  bgcolor: '#fff',
                  boxShadow: 'none',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: { xs: 1.5, sm: 3 },
                  border: '1px solid #f6f8fa',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  '&:hover': { borderColor: '#3b82f6', background: '#f6f8fa' },
                  minWidth: 0,
                  maxWidth: { xs: '100%', sm: 700, md: 900 },
                  width: '100%',
                  mx: 'auto',
                  overflowX: { xs: 'auto', md: 'visible' },
                }}
              >
                <Box width="100%" display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={1} gap={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: 17, sm: 20 }, color: '#58a6ff' }}>
                    Order <span style={{ color: '#6366f1' }}>#{order.id}</span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: 13, sm: 15 } }}>
                    {new Date(order.time).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, width: '100%', bgcolor: '#e0e7ef' }} />
                <Box width="100%" mb={1}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#58a6ff', fontSize: { xs: 14, sm: 16 } }}>Shipping Address:</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: 13, sm: 15 } }}>
                    {order.shippingAddress ? `${order.shippingAddress.street} ${order.shippingAddress.homeNumber || ''}, ${order.shippingAddress.city}, ${order.shippingAddress.country} ${order.shippingAddress.zipCode ? ' (' + order.shippingAddress.zipCode + ')' : ''}` : 'N/A'}
                  </Typography>
                </Box>
                {cartSnapshot ? (
                  <Box width="100%" mb={1}>
                    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        <b>Payment:</b> {cartSnapshot.paymentMethod || 'N/A'}
                      </Typography>
                    </Box>
                    {Array.isArray(cartSnapshot.storeSnapshots) && cartSnapshot.storeSnapshots.length > 0 && cartSnapshot.storeSnapshots.map((store: any) => {
                      const products = Array.isArray(store.products) ? store.products : [];
                      const liveName = liveStoreNames[store.storeId];
                      const storeDisplayName = liveName || (store.storeName && store.storeName !== store.storeId ? store.storeName : null);
                      // Calculate total order price for this store
                      const totalOrderPrice = products.reduce((sum: number, product: any) => {
                        if (product.discountPrice && product.discountPrice < product.price * product.quantity) {
                          return sum + product.discountPrice;
                        }
                        return sum + (product.price * product.quantity);
                      }, 0);
                      return (
                        <Box key={store.storeId} mb={2} pl={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#58a6ff', mb: 0.5, display: 'flex', alignItems: 'center' }}>
                            🏬 Store:
                            {storeDisplayName ? (
                              <Button
                                variant="text"
                                size="small"
                                sx={{ ml: 0.5, p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, color: '#58a6ff' }}
                                onClick={() => window.location.href = `/store/${store.storeId}`}
                              >
                                {storeDisplayName}
                              </Button>
                            ) : (
                              <span style={{ color: 'red', marginLeft: 6, fontWeight: 600 }}>
                                Unknown store
                              </span>
                            )}
                          </Typography>
                          <Box sx={{ mt: 0.5, mb: 1 }}>
                            <RatingComponent
                              value={store.rating ?? 0}
                              size="small"
                              onChange={async (newValue) => {
                                try {
                                  await sdk.createStoreReview({
                                    id: null,
                                    productId: null,
                                    storeId: store.storeId,
                                    writerId: null,
                                    title: '',
                                    body: '',
                                    rating: Math.round(newValue),
                                    date: null,
                                  });
                                  if (typeof setLiveStoreNames === 'function') {
                                    const updated = await sdk.getStore(store.storeId);
                                    setLiveStoreNames((prev: any) => ({ ...prev, [store.storeId]: updated.name }));
                                  }
                                  if (typeof setOrders === 'function') {
                                    const updatedOrders = await sdk.getUserOrders({ page: 0, size: PAGE_SIZE });
                                    setOrders(updatedOrders);
                                  }
                                } catch (err: any) {
                                  alert('Failed to submit store rating. ' + (err?.message || err));
                                }
                              }}
                            />
                          </Box>
                          {products.length > 0 ? (
                            <List disablePadding sx={{ ml: 1 }}>
                              {products.map((product: any) => (
                                <ListItem key={product.productId || product.id} sx={{ pl: 0, pr: 0, py: 0.5, display: 'flex', alignItems: 'center', bgcolor: 'transparent', borderBottom: '1px solid #f1f5f9', mb: 0.5, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                  <Box flex={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#22223b' }}>{product.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      × {product.quantity} @ {product.price ? product.price.toFixed(2) : '?'}₪ each
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                      Total: {product.discountPrice && product.discountPrice < product.price * product.quantity ? (
                                        <>
                                          <span style={{ textDecoration: "line-through", color: "#888" }}>
                                            {(product.price * product.quantity).toFixed(2)}₪
                                          </span>
                                          &nbsp;
                                          <span style={{ color: "#388e3c", fontWeight: "bold" }}>
                                            {product.discountPrice.toFixed(2)}₪
                                          </span>
                                        </>
                                      ) : (
                                        <span>{(product.price * product.quantity).toFixed(2)}₪</span>
                                      )}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ ml: 2 }}>
                                    <RatingComponent
                                      value={product.rating ?? 0}
                                      size="small"
                                      onChange={async (newValue) => {
                                        try {
                                          await sdk.createProductReview({
                                            id: null,
                                            productId: product.productId || product.id,
                                            storeId: store.storeId,
                                            writerId: null,
                                            title: '',
                                            body: '',
                                            rating: Math.round(newValue),
                                            date: null,
                                          });
                                          if (typeof setOrders === 'function') {
                                            const updatedOrders = await sdk.getUserOrders({ page: 0, size: PAGE_SIZE });
                                            setOrders(updatedOrders);
                                          }
                                        } catch (err: any) {
                                          alert('Failed to submit product rating. ' + (err?.message || err));
                                        }
                                      }}
                                    />
                                  </Box>
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>No products found.</Typography>
                          )}
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'gray', mt: 1 }}>
                            Store total: {totalOrderPrice.toFixed(2)}₪
                          </Typography>
                          <Divider sx={{ mt: 1, mb: 1, opacity: 0.2 }} />
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Cart snapshot not available.</Typography>
                )}
                <Divider sx={{ mt: 2, width: '100%', bgcolor: '#e0e7ef' }} />
                {cartSnapshot && Array.isArray(cartSnapshot.storeSnapshots) && cartSnapshot.storeSnapshots.length > 0 && (
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mt: 2, mb: 1, textAlign: 'right' }}>
                    Order total: {
                      cartSnapshot.storeSnapshots.reduce((orderSum: number, store: any) => {
                        const products = Array.isArray(store.products) ? store.products : [];
                        const storeTotal = products.reduce((sum: number, product: any) => {
                          if (product.discountPrice && product.discountPrice < product.price * product.quantity) {
                            return sum + product.discountPrice;
                          }
                          return sum + (product.price * product.quantity);
                        }, 0);
                        return orderSum + storeTotal;
                      }, 0).toFixed(2)
                    }₪
                  </Typography>
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default PurchaseHistoryTab;

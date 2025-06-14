import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, Stack, Tabs, Tab, Divider } from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import { StoreDto, UserOrderDto, PublicUserDto } from "../../../shared/types/dtos";
import RatingComponent from '../../../shared/components/RatingComponent';

const PAGE_SIZE = 25;

type Props = {};

const BOMB_IMAGE = "https://brainrothub.com/brainrot-main/characters/Bombardiro-Crocodilo--1.webp";
const BOMB_SOUND = "https://www.myinstants.com/media/sounds/bombardino-crocodilo_MSpHN9M.mp3";

export const bombardilloEnabled = false;  // Set to true to enable Bombardillo Crocodilo

const BombardilloCrocodilo: React.FC = () => {
  React.useEffect(() => {
    const audio = new Audio(BOMB_SOUND);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  }, []);
  const bombs = [0, 1, 2].map((i) => (
    <Box
      key={i}
      sx={{
        position: 'absolute',
        left: '65%',
        bottom: '-64px',
        transform: 'translateX(-65%)',
        width: { xs: 96, md: 136 },
        height: { xs: 96, md: 136 },
        zIndex: 1201,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '50%',
        background: 'transparent',
        animation: `bomb-drop 2.2s ${i * 0.8}s linear infinite`,
        '@keyframes bomb-drop': {
          '0%': { opacity: 0, transform: 'translateY(0) scale(0.7)' },
          '10%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '80%': { opacity: 1, transform: 'translateY(120px) scale(1.1)' },
          '100%': { opacity: 0, transform: 'translateY(180px) scale(0.7)' },
        },
      }}
    >
      <img
        src={BOMB_IMAGE}
        alt="bomb"
        style={{
          width: '100%',
          height: '36%',
          objectFit: 'cover',
          objectPosition: '50% 92%',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 60, md: 40 },
        left: '-200px',
        zIndex: 1200,
        pointerEvents: 'none',
        width: { xs: 120, md: 180 },
        height: 'auto',
        animation: 'bombardillo-fly-bounce 12s linear infinite',
        '@keyframes bombardillo-fly-bounce': {
          '0%':   { left: '-200px', opacity: 0, transform: 'rotate(-8deg) scaleX(-1)' },
          '5%':   { left: '-200px', opacity: 1, transform: 'rotate(-8deg) scaleX(-1)' },
          '45%':  { left: 'calc(100vw - 120px)', opacity: 1, transform: 'rotate(6deg) scaleX(-1)' },
          '50%':  { left: 'calc(100vw + 200px)', opacity: 0, transform: 'rotate(6deg) scaleX(-1)' },
          '51%':  { left: 'calc(100vw + 200px)', opacity: 0, transform: 'rotate(6deg) scaleX(1)' },
          '55%':  { left: 'calc(100vw + 200px)', opacity: 1, transform: 'rotate(6deg) scaleX(1)' },
          '95%':  { left: '-200px', opacity: 1, transform: 'rotate(-8deg) scaleX(1)' },
          '100%': { left: '-200px', opacity: 0, transform: 'rotate(-8deg) scaleX(1)' },
        },
      }}
    >
      <img
        src={BOMB_IMAGE}
        alt="Bombardillo Crocodilo"
        style={{ width: '100%', height: 'auto', userSelect: 'none', pointerEvents: 'none' }}
        draggable={false}
      />
      {bombs}
    </Box>
  );
};

const UserProfilePage: React.FC<Props> = () => {
  const [user, setUser] = React.useState<PublicUserDto | null>(null);
  const [userLoading, setUserLoading] = React.useState(true);
  const [stores, setStores] = React.useState<StoreDto[]>([]);
  const [storesLoading, setStoresLoading] = React.useState(true);
  const [storesError, setStoresError] = React.useState<string | null>(null);

  const [orders, setOrders] = React.useState<UserOrderDto[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [ordersError, setOrdersError] = React.useState<string | null>(null);

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [cartSnapshots, setCartSnapshots] = useState<Record<string, any>>({});
  const [liveStoreNames, setLiveStoreNames] = useState<Record<string, string | null>>({});

  React.useEffect(() => {
    document.title = "My Profile ";
  }, []);

  React.useEffect(() => {
    setUserLoading(true);
    sdk.getCurrentUserProfileDetails()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, []);

  React.useEffect(() => {
    if (!user) return;
    setStoresLoading(true);
    setStoresError(null);
    sdk.getStores({ page: 0, size: PAGE_SIZE })
      .then(async (allStores) => {
        const sellerStoreIds: string[] = [];
        await Promise.all(
          allStores.map(async (store) => {
            try {
              const officials = await sdk.getStoreOfficials(store.id!);
              if (officials.some((o) => o.id === user.id)) {
                sellerStoreIds.push(store.id!);
              }
            } catch {}
          })
        );
        setStores(allStores.filter((s) => sellerStoreIds.includes(s.id!)));
      })
      .catch((err) => setStoresError(err.message))
      .finally(() => setStoresLoading(false));
  }, [user]);

  React.useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    setOrdersError(null);
    sdk.getUserOrders({ page: 0, size: PAGE_SIZE })
      .then(setOrders)
      .catch((err) => {
        if (
          (err.message && err.message.includes('404')) ||
          (err.message && err.message.includes('Error fetching user orders'))
        ) {
          setOrders([]);
        } else {
          setOrdersError(
            typeof err === 'object' && err !== null && err.message
              ? `Orders error: ${err.message}`
              : `Orders error: ${JSON.stringify(err)}`
          );
        }
        console.error('Orders fetch error:', err);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const missing = orders.filter(o => !cartSnapshots[o.cartSnapshot]).map(o => o.cartSnapshot || `dummy-${o.id}`);
    if (missing.length === 0) return;
    Promise.all(
      missing.map((id) =>
        sdk.getCartSnapshotById(id)
          .then(snap => ({ id, snap }))
          .catch(() => null)
      )
    ).then(results => {
      setCartSnapshots(prev => {
        const next = { ...prev };
        results.forEach(res => { if (res && res.snap) next[res.id] = res.snap; });
        return next;
      });
    });
  }, [orders]);

  useEffect(() => {
    const allStoreIds = new Set<string>();
    Object.values(cartSnapshots).forEach((snap: any) => {
      if (snap && Array.isArray(snap.storeSnapshots)) {
        snap.storeSnapshots.forEach((store: any) => {
          if (store && store.storeId) allStoreIds.add(store.storeId);
        });
      }
    });
    const missing = Array.from(allStoreIds).filter(id => !(id in liveStoreNames));
    if (missing.length === 0) return;
    Promise.all(
      missing.map(id =>
        sdk.getStore(id)
          .then(store => ({ id, name: store.name }))
          .catch(() => ({ id, name: null }))
      )
    ).then(results => {
      setLiveStoreNames(prev => {
        const next = { ...prev };
        results.forEach(({ id, name }) => { next[id] = name; });
        return next;
      });
    });
  }, [cartSnapshots]);

  if (userLoading) {
    return (
      <Box mt={8} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }
  if (user === null) {
    return (
      <Box mt={8} textAlign="center">
        <Alert severity="warning" sx={{ maxWidth: 500, margin: '0 auto' }}>
          You must be logged in to view your profile. Please <a href="/login">log in</a> or <a href="/register">register</a> to access your dashboard.
        </Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ bgcolor: '#fff' }}>
      {bombardilloEnabled && <BombardilloCrocodilo />}
      <Box
        flex={1}
        width="100%"
        maxWidth={{ xs: '100%', xl: 1400 }}
        mx="auto"
        mt={0}
        px={{ xs: 0.5, md: 4, xl: 8 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-start' },
          justifyContent: 'flex-start',
          minHeight: '80vh',
          bgcolor: 'transparent',
          pt: { xs: 2, md: 6 },
          gap: { xs: 2, md: 6, xl: 10 },
        }}
      >
        {/* Sidebar */}
        <Box
          minWidth={{ xs: '100%', md: 240, xl: 280 }}
          maxWidth={{ xs: '100%', md: 280, xl: 320 }}
          flexBasis={{ xs: '100%', md: 260, xl: 300 }}
          width={{ xs: '100%', md: 260, xl: 300 }}
          mr={0}
          mb={{ xs: 2, md: 0 }}
          sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 2,
            border: '1px solid #e0e7ef',
            p: 0,
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            ml: 0,
            width: { xs: '100%', md: 260, xl: 300 },
            minWidth: { xs: '100%', md: 240, xl: 280 },
            maxWidth: { xs: '100%', md: 280, xl: 320 },
          }}
        >
          <Box px={3} py={3} borderBottom="1px solid #e0e7ef">
            <Typography variant="h6" sx={{ color: '#22223b', fontWeight: 700, mb: 0.5, fontSize: { xs: 18, sm: 20 } }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: { xs: 13, sm: 15 } }}>
              Your personal account
            </Typography>
          </Box>
          <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={(_, v) => setSelectedTab(v)}
            variant="scrollable"
            sx={{
              borderRight: 0,
              bgcolor: 'transparent',
              borderRadius: 3,
              minHeight: 120,
              px: 0,
              pt: 0,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: { xs: 15, sm: 17 },
                color: '#22223b',
                borderRadius: 2,
                mb: 0.5,
                textAlign: 'left',
                justifyContent: 'flex-start',
                px: 2,
                py: 1.2,
                minHeight: 44,
                transition: 'background 0.2s, color 0.2s',
                '&.Mui-selected': {
                  bgcolor: '#f6f8fa',
                  color: '#3b82f6',
                  boxShadow: 'none',
                },
                '&:hover': {
                  bgcolor: '#f6f8fa',
                  color: '#3b82f6',
                },
              },
              boxShadow: 'none',
            }}
          >
            <Tab label="My Stores" sx={{ alignItems: 'flex-start' }} />
            <Tab label="Purchase History" sx={{ alignItems: 'flex-start' }} />
            <Tab label="My Bids" sx={{ alignItems: 'flex-start' }} />
          </Tabs>
        </Box>
        {/* Main content */}
        <Box
          flex={1}
          minWidth={0}
          maxWidth={{ xs: '100%', md: 'calc(100vw - 320px - 64px)', xl: 1000 }}
          width={{ xs: '100%', md: 'auto' }}
          sx={{
            ml: 0,
            bgcolor: 'transparent',
            borderRadius: 0,
            boxShadow: 'none',
            border: 'none',
            p: { xs: 0, md: 0 },
            color: '#22223b',
            minHeight: 600,
            width: { xs: '100%', md: 'auto' },
            flex: 1,
          }}
        >
          {selectedTab === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#58a6ff', fontSize: { xs: 20, sm: 24 } }}>
                My Stores
              </Typography>
              {storesLoading ? (
                <Box display="flex" justifyContent="center" py={2}><CircularProgress size={28} /></Box>
              ) : storesError ? (
                <Alert severity="error">{storesError}</Alert>
              ) : stores.length === 0 ? (
                <Typography color="text.secondary">You are not a seller in any store yet.</Typography>
              ) : (
                <List>
                  {stores.map((store) => (
                    <ListItem
                      key={store.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        bgcolor: '#fff',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        border: '1px solid #f6f8fa',
                        '&:hover': {
                          bgcolor: '#f6f8fa',
                          textDecoration: 'underline',
                        },
                        width: { xs: '100%', md: 'auto' },
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                      onClick={() => window.location.href = `/store/${store.id}`}
                    >
                      <ListItemText
                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#58a6ff' }}>{store.name}</Typography>}
                        secondary={store.description}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
          {selectedTab === 1 && (
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
                              const liveName = liveStoreNames[store.storeId];
                              const storeDisplayName = liveName || (store.storeName && store.storeName !== store.storeId ? store.storeName : null);
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
                                          // Refresh the store rating in the UI
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
                                  {Array.isArray(store.products) && store.products.length > 0 ? (
                                    <List disablePadding sx={{ ml: 1 }}>
                                      {store.products.map((product: any) => (
                                        <ListItem key={product.productId} sx={{ pl: 0, pr: 0, py: 0.5, display: 'flex', alignItems: 'center', bgcolor: 'transparent', borderBottom: '1px solid #f1f5f9', mb: 0.5, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                          <Box flex={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#22223b' }}>{product.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              × {product.quantity} @ ${product.price ? product.price.toFixed(2) : '?'} each
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
                                                    productId: product.productId,
                                                    storeId: store.storeId,
                                                    writerId: null,
                                                    title: '',
                                                    body: '',
                                                    rating: Math.round(newValue),
                                                    date: null,
                                                  });
                                                  // Refresh the product rating in the UI
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
                                </Box>
                              );
                            })}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Cart snapshot not available.</Typography>
                        )}
                        <Divider sx={{ mt: 2, width: '100%', bgcolor: '#e0e7ef' }} />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          )}
          {selectedTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#58a6ff', fontSize: { xs: 20, sm: 24 } }}>
                Bids
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ minWidth: 180, fontSize: { xs: 14, sm: 16 } }}
                  href="#BID_REQUESTS_PAGE_URL"
                >
                  View Bid Requests
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ minWidth: 180, fontSize: { xs: 14, sm: 16 } }}
                  href="#APPROVED_BIDS_PAGE_URL"
                >
                  View Approved Bids
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
      <Box
        component="footer"
        position={{ xs: 'static', md: 'fixed' }}
        left={0}
        bottom={0}
        width="100%"
        py={2}
        bgcolor="#fff"
        textAlign="center"
        zIndex={1300}
        boxShadow={1}
        sx={{ px: { xs: 1, md: 0 } }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 11, sm: 13 } }}>
          © 2025 Kaj-Kadir. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfilePage;

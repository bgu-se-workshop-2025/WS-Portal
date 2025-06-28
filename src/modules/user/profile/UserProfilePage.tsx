import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Tabs, Tab } from "@mui/material";
import { sdk } from "../../../sdk/sdk";
import { StoreDto, UserOrderDto, PublicUserDto } from "../../../shared/types/dtos";
import { MyStoresTab, PurchaseHistoryTab, MyBidsTab, UserProfileTabProps } from "./UserProfileTabs";
import BombardilloCrocodilo from "./BombardilloCrocodilo";

const PAGE_SIZE = 25;

const bombardilloEnabled = false; //-----------

const UserProfilePage: React.FC = () => {
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

  const tabProps: UserProfileTabProps = {
    user,
    stores,
    storesLoading,
    storesError,
    orders,
    ordersLoading,
    ordersError,
    cartSnapshots,
    liveStoreNames,
    setOrders,
    setLiveStoreNames,
  };

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
          {selectedTab === 0 && <MyStoresTab {...tabProps} />}
          {selectedTab === 1 && <PurchaseHistoryTab {...tabProps} />}
          {selectedTab === 2 && <MyBidsTab {...tabProps} />}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfilePage;

import React from "react";
import { UserProfileTabProps } from "./UserProfileTabs";
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from "@mui/material";

const MyStoresTab: React.FC<UserProfileTabProps> = ({ stores, storesLoading, storesError }) => {
  return (
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
  );
};

export default MyStoresTab;

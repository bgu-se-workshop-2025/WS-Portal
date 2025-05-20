import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import StoreProducts from './components/subpages/StoreProducts';

interface UserStorePageProps {
    id?: string;
}

const UserStorePage: React.FC<UserStorePageProps> = ({ id }) => {
  return (
    <StoreProducts storeId={id || ''} />
  );
};

export default UserStorePage;

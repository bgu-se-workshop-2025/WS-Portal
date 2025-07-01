import React from "react";

export interface UserProfileTabProps {
  user: any;
  stores: any[];
  storesLoading: boolean;
  storesError: string | null;
  orders: any[];
  ordersLoading: boolean;
  ordersError: string | null;
  cartSnapshots: Record<string, any>;
  liveStoreNames: Record<string, string | null>;
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setLiveStoreNames: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

export { default as MyStoresTab } from './MyStoresTab';
export { default as PurchaseHistoryTab } from './PurchaseHistoryTab';
export { default as MyBidsTab } from './MyBidsTab';
export { default as MyMessagesTab } from './MyMessagesTab';

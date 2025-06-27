import { useState, useCallback, useMemo } from "react";
import { BidDto, BidRequestDto, Pageable } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";

export type useBidResponse = {
  loading: { create: boolean; action: boolean; list: boolean; remaining: boolean };
  error?: string;
  requests: BidRequestDto[];
  bids: BidDto[];
  remainingSellers: Record<string, string[]>;
  createBidRequest: (r: BidRequestDto) => Promise<void>;
  acceptBidRequest: (id: string) => Promise<void>;
  rejectBidRequest: (id: string) => Promise<void>;
  submitAlternativePrice: (id: string, price: number) => Promise<void>;
  cancelBidRequest: (id: string) => Promise<void>;
  getBidRequestsOfStore: (storeId: string, pageable: Pageable) => Promise<void>;
  getBidRequestsOfUser: (pageable: Pageable) => Promise<void>;
  getBidsOfUser: (pageable: Pageable) => Promise<void>;
  getBidsOfStore: (storeId: string, pageable: Pageable) => Promise<void>;
  getSellersRemaining: (bidRequestId: string) => Promise<string[]>;
  resetError: () => void;
};

const useBid = (): useBidResponse => {
  const [error, setError] = useState<string>();
  const [requests, setRequests] = useState<BidRequestDto[]>([]);
  const [bids, setBids] = useState<BidDto[]>([]);
  const [remainingSellers, setRemainingSellers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState({ create: false, action: false, list: false, remaining: false });

  const resetError = useCallback(() => setError(undefined), []);

  const createBidRequest = useCallback(async (r: BidRequestDto) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, create: true }));
      const resp = await sdk.createBidRequest(r);
      setRequests(prev => [...prev, resp]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(l => ({ ...l, create: false }));
    }
  }, []);

  const acceptBidRequest = useCallback(async (id: string) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, action: true }));
      await sdk.acceptBidRequest(id);
      setRequests(prev =>
        prev.map(r => r.bidRequestId === id ? { ...r, requestStatus: "ACCEPTED" } : r)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, action: false }));
    }
  }, []);

  const rejectBidRequest = useCallback(async (id: string) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, action: true }));
      await sdk.rejectBidRequest(id);
      setRequests(prev =>
        prev.map(r => r.bidRequestId === id ? { ...r, requestStatus: "REJECTED" } : r)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, action: false }));
    }
  }, []);

  const submitAlternativePrice = useCallback(async (id: string, price: number) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, action: true }));
      await sdk.submitAlternativePrice(id, price);
      setRequests(prev =>
        prev.map(r => r.bidRequestId === id ? { ...r, requestStatus: "RECEIVED_ALTERNATIVE_PRICE", price } : r)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, action: false }));
    }
  }, []);

  const cancelBidRequest = useCallback(async (id: string) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, action: true }));
      await sdk.cancelBidRequest(id);
      setRequests(prev =>
        prev.map(r => r.bidRequestId === id ? { ...r, requestStatus: "CANCELLED" } : r)
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, action: false }));
    }
  }, []);

  const getBidRequestsOfStore = useCallback(async (storeId: string, pageable: Pageable) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, list: true }));
      const resp = await sdk.getBidRequestsOfStore(storeId, pageable);
      setRequests(resp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, list: false }));
    }
  }, []);

  const getBidRequestsOfUser = useCallback(async (pageable: Pageable) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, list: true }));
      const userId = (await sdk.getCurrentUserProfileDetails()).id;
      const resp = await sdk.getBidRequestsOfUser(userId, pageable);
      setRequests(resp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, list: false }));
    }
  }, []);

  const getBidsOfUser = useCallback(async (pageable: Pageable) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, list: true }));
      const userId = (await sdk.getCurrentUserProfileDetails()).id;
      const resp = await sdk.getBidsOfUser(userId, pageable);
      setBids(resp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, list: false }));
    }
  }, []);

  const getBidsOfStore = useCallback(async (storeId: string, pageable: Pageable) => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, list: true }));
      const resp = await sdk.getBidsOfStore(storeId, pageable);
      setBids(resp);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(l => ({ ...l, list: false }));
    }
  }, []);

  const getSellersRemaining = useCallback(async (bidRequestId: string): Promise<string[]> => {
    try {
      setError(undefined);
      setLoading(l => ({ ...l, remaining: true }));
      const arr = await sdk.getSellersRemaining(bidRequestId);
      const sellers = arr.map(s => String(s));
      setRemainingSellers(prev => ({ ...prev, [bidRequestId]: sellers }));
      return sellers;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(l => ({ ...l, remaining: false }));
    }
  }, []);

  return useMemo(() => ({
    loading,
    error,
    requests,
    bids,
    remainingSellers,
    createBidRequest,
    acceptBidRequest,
    rejectBidRequest,
    submitAlternativePrice,
    cancelBidRequest,
    getBidRequestsOfStore,
    getBidRequestsOfUser,
    getBidsOfUser,
    getBidsOfStore,
    getSellersRemaining,
    resetError,
  }), [
    loading, error, requests, bids, remainingSellers,
    createBidRequest, acceptBidRequest, rejectBidRequest,
    submitAlternativePrice, cancelBidRequest,
    getBidRequestsOfStore, getBidRequestsOfUser,
    getBidsOfUser, getBidsOfStore, getSellersRemaining, resetError
  ]);
};

export default useBid;

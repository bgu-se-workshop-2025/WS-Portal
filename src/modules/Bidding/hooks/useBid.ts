import { useState } from "react";
import { BidDto, BidRequestDto, Pageable } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";

export type useBidResponse = {
    loading: boolean;
    error: string | undefined;
    requests: BidRequestDto[];
    bids: BidDto[];
    createBidRequest: (bidReq: BidRequestDto) => Promise<void>;
    acceptBidRequest: (bidRequestId: string) => Promise<void>;
    rejectBidRequest: (bidRequestId: string) => Promise<void>;
    submitAlternativePrice: (
        bidRequestId: string,
        newPrice: number
    ) => Promise<void>;
    getBidsOfUser: (pageable: Pageable) => Promise<void>;
    getBidsOfStore: (storeId: string, pageable: Pageable) => Promise<void>;
    getBidRequestsOfUser: (userId: string, pageable: Pageable) => Promise<void>;
    getBidRequestsOfStore: (
        storeId: string,
        pageable: Pageable
    ) => Promise<void>;
};

const useBid = (): useBidResponse => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [requests, setRequests] = useState<BidRequestDto[]>([]);
    const [bids, setBids] = useState<BidDto[]>([]);
    const [loading, setLoading] = useState(false);

    const createBidRequest = async (bidReq: BidRequestDto) => {
        try {
            setLoading(true);
            const response = await sdk.createBidRequest(bidReq);
            setRequests([response]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const acceptBidRequest = async (bidRequestId: string) => {
        try {
            setLoading(true);
            await sdk.acceptBidRequest(bidRequestId);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const rejectBidRequest = async (bidRequestId: string) => {
        try {
            setLoading(true);
            await sdk.rejectBidRequest(bidRequestId);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const submitAlternativePrice = async (
        bidRequestId: string,
        newPrice: number
    ) => {
        try {
            setLoading(true);
            await sdk.submitAlternativePrice(bidRequestId, newPrice);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBidsOfUser = async (pageable: Pageable) => {
        try {
            setLoading(true);
            const response = await sdk.getBidsOfUser(pageable);
            setBids(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBidsOfStore = async (storeId: string, pageable: Pageable) => {
        try {
            setLoading(true);
            const response = await sdk.getBidsOfStore(storeId, pageable);
            setBids(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBidRequestsOfUser = async (
        storeId: string,
        pageable: Pageable
    ) => {
        try {
            setLoading(true);
            const response = await sdk.getBidRequestsOfUser(storeId, pageable);
            setRequests(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBidRequestsOfStore = async (
        storeId: string,
        pageable: Pageable
    ) => {
        try {
            setLoading(true);
            const response = await sdk.getBidRequestsOfStore(storeId, pageable);
            setRequests(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        requests,
        bids,
        createBidRequest,
        acceptBidRequest,
        rejectBidRequest,
        submitAlternativePrice,
        getBidsOfUser,
        getBidsOfStore,
        getBidRequestsOfUser,
        getBidRequestsOfStore,
    };
};

export default useBid;

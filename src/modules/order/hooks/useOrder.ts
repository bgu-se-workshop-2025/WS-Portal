import { useState, useCallback } from "react";
import { AuctionBidDto, OrderRequestDetails, BidOrderRequestDetails, UserOrderDto } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";

interface UseOrderReturn {
    loading: boolean;
    error: string | null;
    createOrder: (
        orderRequest: OrderRequestDetails
    ) => Promise<UserOrderDto | undefined>;
    createOrderForBid: (
        orderRequest: BidOrderRequestDetails
    ) => Promise<UserOrderDto | undefined>;
    placeBid: (
        productId: string,
        auctionBid: AuctionBidDto
    ) => Promise<AuctionBidDto | undefined>;
}

const useOrder = (): UseOrderReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = useCallback(
        async (orderRequest: OrderRequestDetails) => {
            setLoading(true);
            setError(null);
            try {
                const order = await sdk.createOrder(orderRequest);
                return order;
            } catch (err: any) {
                console.error("Error creating order:", err);
                setError(err.message || "Failed to create order");
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createOrderForBid = useCallback(
        async (orderRequest: BidOrderRequestDetails) => {
            setLoading(true);
            setError(null);
            try {
                const order = await sdk.createOrderForBid(orderRequest);
                return order;
            } catch (err: any) {
                console.error("Error creating order for bid:", err);
                setError(err.message || "Failed to create order for bid");
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        []
    );


    const placeBid = useCallback(
        async (productId: string, auctionBid: AuctionBidDto) => {
            setLoading(true);
            setError(null);
            try {
                const bid = await sdk.placeBid(productId, auctionBid);
                return bid;
            } catch (err: any) {
                console.error("Error placing bid:", err);
                setError(err.message || "Failed to place bid");
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        error,
        createOrder,
        createOrderForBid,
        placeBid,
    };
};

export default useOrder;

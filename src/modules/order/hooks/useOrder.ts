import { useState, useCallback } from "react";
import { AuctionBidDto, OrderRequestDetails, BidOrderRequestDetails, UserOrderDto } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";
import { useAsyncOperation } from "../../../shared/hooks/useErrorHandler";
import { AppError, ErrorType, ErrorSeverity } from "../../../shared/types/errors";

interface UseOrderReturn {
    loading: boolean;
    error: AppError | null;
    data: UserOrderDto | null;
    createOrder: (orderRequest: OrderRequestDetails) => Promise<UserOrderDto | null>;
    createOrderForBid: (orderRequest: BidOrderRequestDetails) => Promise<UserOrderDto | undefined>;
    placeBid: (productId: string, auctionBid: AuctionBidDto) => Promise<AuctionBidDto | undefined>;
    retry: () => Promise<void>;
    clearError: () => void;
}

const useOrder = (): UseOrderReturn => {
    // Additional state for bid operations
    const [bidLoading, setBidLoading] = useState(false);
    const [bidError, setBidError] = useState<string | null>(null);

    const {
        data,
        isLoading,
        error,
        execute,
        retry,
        clearError,
        reset
    } = useAsyncOperation<UserOrderDto>({
        component: 'OrderPage',
        operation: 'Create Order'
    });

    const createOrder = useCallback(
        async (orderRequest: OrderRequestDetails): Promise<UserOrderDto | null> => {
            return execute(async () => {
                return await sdk.createOrder(orderRequest);
            });
        },
        [execute]
    );

    const createOrderForBid = useCallback(
        async (orderRequest: BidOrderRequestDetails): Promise<UserOrderDto | undefined> => {
            setBidLoading(true);
            setBidError(null);
            try {
                const order = await sdk.createOrderForBid(orderRequest);
                return order;
            } catch (err: any) {
                console.error("Error creating order for bid:", err);
                setBidError(err.message || "Failed to create order for bid");
                return undefined;
            } finally {
                setBidLoading(false);
            }
        },
        []
    );

    const placeBid = useCallback(
        async (productId: string, auctionBid: AuctionBidDto): Promise<AuctionBidDto | undefined> => {
            setBidLoading(true);
            setBidError(null);
            try {
                const bid = await sdk.placeBid(productId, auctionBid);
                return bid;
            } catch (err: any) {
                console.error("Error placing bid:", err);
                setBidError(err.message || "Failed to place bid");
                return undefined;
            } finally {
                setBidLoading(false);
            }
        },
        []
    );

    const clearAllErrors = useCallback(() => {
        clearError();
        setBidError(null);
    }, [clearError]);

    // Create proper AppError for bid errors
    const bidAppError: AppError | null = bidError ? {
        type: ErrorType.UNKNOWN_ERROR,
        severity: ErrorSeverity.ERROR,
        title: 'Bid Operation Failed',
        message: bidError,
        timestamp: Date.now(),
        userFriendlyMessage: 'There was an error with your bid operation. Please try again.',
        actionable: true,
        retryable: true
    } : null;

    return {
        loading: isLoading || bidLoading,
        error: error || bidAppError,
        data,
        createOrder,
        createOrderForBid,
        placeBid,
        retry,
        clearError: clearAllErrors
    };
};

export default useOrder;

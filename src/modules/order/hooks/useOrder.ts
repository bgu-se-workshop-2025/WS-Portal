import { useState, useCallback } from "react";
import { OrderRequestDetails, UserOrderDto } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";

interface UseOrderReturn {
    loading: boolean;
    error: string | null;
    createOrder: (
        orderRequest: OrderRequestDetails
    ) => Promise<UserOrderDto | undefined>;
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

    return {
        loading,
        error,
        createOrder,
    };
};

export default useOrder;

import { useCallback } from "react";
import { OrderRequestDetails, UserOrderDto } from "../../../shared/types/dtos";
import { sdk } from "../../../sdk/sdk";
import { useAsyncOperation } from "../../../shared/hooks/useErrorHandler";
import type { AppError } from "../../../shared/types/errors";

interface UseOrderReturn {
    loading: boolean;
    error: AppError | null;
    data: UserOrderDto | null;
    createOrder: (orderRequest: OrderRequestDetails) => Promise<UserOrderDto | null>;
    retry: () => Promise<void>;
    clearError: () => void;
}

const useOrder = (): UseOrderReturn => {
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

    return {
        loading: isLoading,
        error,
        data,
        createOrder,
        retry,
        clearError
    };
};

export default useOrder;

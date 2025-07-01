import { useState } from "react";
import { sdk } from "../../../../sdk/sdk";
import {
    AdminDetailsDto,
    SuspensionTicketDto,
    StoreDto,
} from "../../../../shared/types/dtos";

export interface useAdminResponse {
    result: AdminDetailsDto | null;
    loading: boolean;
    error?: string;
    suspensions: SuspensionTicketDto[];
    stores: StoreDto[];
    suspendUser: (userId: string, millis: number) => Promise<void>;
    elevateUser: (userId: string) => Promise<void>;
    isAdmin: () => Promise<AdminDetailsDto>;
    cancelSuspensionUser: (userId: string) => Promise<void>;
    getSuspensions: (
        page: number,
        limit: number
    ) => Promise<SuspensionTicketDto[]>;
    getStores: (page: number, limit: number) => Promise<StoreDto[]>;
    deleteStore: (storeId: string) => Promise<void>;
}

const useAdmin = (): useAdminResponse => {
    const [result, setResult] = useState<AdminDetailsDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [suspensions, setSuspensions] = useState<SuspensionTicketDto[]>([]);
    const [stores, setStores] = useState<StoreDto[]>([]);

    const suspendUser = async (
        userId: string,
        millis: number
    ): Promise<void> => {
        setLoading(true);
        try {
            await sdk.suspendUser(userId, millis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const elevateUser = async (userId: string): Promise<void> => {
        setLoading(true);
        try {
            await sdk.elevateUser(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = async (): Promise<AdminDetailsDto> => {
        setLoading(true);
        try {
            const response = await sdk.isAdmin();
            setResult(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelSuspensionUser = async (userId: string): Promise<void> => {
        setLoading(true);
        try {
            await sdk.cancelSuspensionUser(userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const getSuspensions = async (
        page: number,
        limit: number
    ): Promise<SuspensionTicketDto[]> => {
        setLoading(true);
        try {
            const response = await sdk.getSuspensions(page, limit);
            setSuspensions(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getStores = async (
        page: number,
        limit: number
    ): Promise<StoreDto[]> => {
        setLoading(true);
        try {
            const response = await sdk.getStores({ page, size: limit });
            setStores(response);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteStore = async (storeId: string): Promise<void> => {
        setLoading(true);
        try {
            await sdk.deleteStore(storeId);
            // Remove the deleted store from the list
            setStores(prev => prev.filter(store => store.id !== storeId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        result,
        loading,
        error,
        suspensions,
        stores,
        suspendUser,
        elevateUser,
        isAdmin,
        cancelSuspensionUser,
        getSuspensions,
        getStores,
        deleteStore,
    };
};

export default useAdmin;

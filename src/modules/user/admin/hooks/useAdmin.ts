import { useState } from "react";
import { sdk } from "../../../../sdk/sdk";

export interface useAdminResponse {
    result: boolean;
    loading: boolean;
    error?: string;
    suspendUser?: (userId: string, millis: number) => Promise<void>;
    elevateUser?: (userId: string) => Promise<void>;
    isAdmin?: () => Promise<void>;
}

const useAdmin = (): useAdminResponse => {
    const [result, setResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    const suspendUser = async (userId: string, millis: number): Promise<void> => {
        setLoading(true);
        try {
            const response = await sdk.suspendUser(userId, millis);
            if (response) {
                setResult(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const elevateUser = async (userId: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await sdk.elevateUser(userId);
            if (response) {
                setResult(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await sdk.isAdmin();
            if (response && response.id) {
                setResult(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return { result, loading, error, suspendUser, elevateUser, isAdmin };
}

export default useAdmin;
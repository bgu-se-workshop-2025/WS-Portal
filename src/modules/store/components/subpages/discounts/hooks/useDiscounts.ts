import { useState, useEffect } from 'react';
import { sdk } from '../../../../../../sdk/sdk';
import { DiscountDataModel, getDiscountContract, getDiscountDataModelFromContract } from '../DiscountTypes';
import { DiscountDto } from '../../../../../../sdk/modules/store/policy';

interface UseDiscountsProps {
    storeId: string;
    productId?: string;
}

interface UseDiscountsResult {
    discounts: DiscountDataModel[];
    loading: boolean;
    error: string | null;
    fetchDiscounts: () => Promise<void>;
    createDiscount: (discount: DiscountDataModel) => Promise<void>;
    updateDiscount: (discount: DiscountDataModel) => Promise<void>;
    deleteDiscount: (discountId: string) => Promise<void>;
}

const useDiscounts = ({ storeId, productId }: UseDiscountsProps): UseDiscountsResult => {
    const [discounts, setDiscounts] = useState<DiscountDataModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDiscounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const discountDtos = await sdk.getDiscountPolicies(storeId, productId);
            const discountDataModels = discountDtos.map((dto: DiscountDto) => getDiscountDataModelFromContract(dto, storeId, productId));
            setDiscounts(discountDataModels);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch discounts');
        } finally {
            setLoading(false);
        }
    };

    const createDiscount = async (discount: DiscountDataModel) => {
        setLoading(true);
        setError(null);
        try {
            const discountDto = getDiscountContract(discount);
            const createdDiscountDto = await sdk.createDiscountPolicy(storeId, discountDto, productId);
            const createdDiscountDataModel = getDiscountDataModelFromContract(createdDiscountDto, storeId, productId);
            setDiscounts([...discounts, createdDiscountDataModel]);
        } catch (err: any) {
            setError(err.message || 'Failed to create discount');
        } finally {
            setLoading(false);
        }
    };

    const updateDiscount = async (discount: DiscountDataModel) => {
        setLoading(true);
        setError(null);
        try {
            if (!discount.id) {
                throw new Error('Discount ID is required for updates');
            }
            const discountDto = getDiscountContract(discount);
            discountDto.id = discount.id;
            await sdk.deleteDiscountPolicy(storeId, discount.id, productId);
            const createdDiscountDto = await sdk.createDiscountPolicy(storeId, discountDto, productId);
            const createdDiscountDataModel = getDiscountDataModelFromContract(createdDiscountDto, storeId, productId);
            setDiscounts(discounts.map(d => (d.id === discount.id ? createdDiscountDataModel : d)));
        } catch (err: any) {
            setError(err.message || 'Failed to update discount');
        } finally {
            setLoading(false);
        }
    };

    const deleteDiscount = async (discountId: string) => {
        setLoading(true);
        setError(null);
        try {
            await sdk.deleteDiscountPolicy(storeId, discountId, productId);
            setDiscounts(discounts.filter(d => d.id !== discountId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete discount');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, [storeId, productId]);

    return {
        discounts,
        loading,
        error,
        fetchDiscounts,
        createDiscount,
        updateDiscount,
        deleteDiscount,
    };
};

export default useDiscounts;
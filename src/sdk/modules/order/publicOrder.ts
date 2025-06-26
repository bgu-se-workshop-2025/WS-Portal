import { SDK } from '../../sdk';
import { UserOrderDto, OrderRequestDetails } from "../../../shared/types/dtos.ts";
import type { ErrorContext } from '../../../shared/types/errors';

const publicOrder = "public/orders";

export async function createOrder(this: SDK, request: OrderRequestDetails, context?: ErrorContext): Promise<UserOrderDto> {
    return await this.postWithErrorHandling<UserOrderDto>(
        `${publicOrder}`, 
        request,
        {
            operation: 'Create Order',
            component: 'OrderPage',
            ...context
        }
    );
}
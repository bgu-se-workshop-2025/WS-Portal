import { SDK } from '../../sdk';
import { UserOrderDto, OrderRequestDetails, BidOrderRequestDetails } from "../../../shared/types/dtos.ts";
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

export async function createOrderForBid(this: SDK, request: BidOrderRequestDetails): Promise<UserOrderDto> {
    const response = await this.post(`${publicOrder}/bid`, request);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create order for bid: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto;
    return result;
}
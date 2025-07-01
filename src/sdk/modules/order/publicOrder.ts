import { SDK } from '../../sdk';
import { UserOrderDto, OrderRequestDetails, BidOrderRequestDetails } from "../../../shared/types/dtos.ts";

const publicOrder = "public/orders";

export async function createOrder(this: SDK, request: OrderRequestDetails): Promise<UserOrderDto> {
    const response = await this.post(`${publicOrder}`, request);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create order: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto;
    return result;
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
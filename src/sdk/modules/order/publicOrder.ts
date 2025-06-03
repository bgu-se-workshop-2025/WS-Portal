import { SDK } from '../../sdk';
import { UserOrderDto, OrderRequestDetails } from "../../../shared/types/dtos.ts";

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
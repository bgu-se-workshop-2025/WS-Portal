import { SDK } from '../../sdk';

const publicOrder = "public/order";

export interface UserOrderDto {
    id: string;
    // TODO time: LocalDateTime;
    buyerId: string;
    // TODO ShippingAdderss
    cartSnapshot: string;
}

export interface OrderRequestDetails {
    // TODO cart: CartDto;
    // TODO paymentDatails: PaymentDetails;
    // TODO shippingAddress: ShippingAddress;
}

export async function createOrder(this: SDK, orderRequestDetails: OrderRequestDetails): Promise<UserOrderDto> {
    const response = await this.post(`${publicOrder}`, orderRequestDetails);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create order: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto;
    return result;
}
import { SDK } from '../../sdk';

const publicOrder = "public/order";

export interface UserOrderDto {
    id: string;
    time: string;
    buyerId: string;
    // TODO ShippingAdderss
    cartSnapshot: string;
}

export interface OrderRequestDetails {
    cart: CartDto;
    paymentDetails: PaymentDetails;
    // TODO shippingAddress: ShippingAddress;
}

export interface CartDto {
    ownerId: string;
    stores: CartStoreBasketDto[];
}

export interface CartStoreBasketDto {
    storeId: string;
    products: CartProductEntryDto[];
}

export interface CartProductEntryDto {
    productId: string;
    quantity: number;
}

export interface PaymentDetails {
    paymentMethod: PaymentMethod;
    externalId: string;
    payerEmail: string;
    payerId: string;
}

export enum PaymentMethod {
    CREDIT_CARD = 0,
    PAYPAL = 1,
    APPLE_PAY = 2,
    GOOGLE_PAY = 3,
}



export async function createOrder(this: SDK, request: OrderRequestDetails): Promise<UserOrderDto> {
    const response = await this.post(`${publicOrder}`, request);

    if(!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create order: ${error}`);
    }

    const result = (await response.json()) as UserOrderDto;
    return result;
}
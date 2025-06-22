import { SDK } from "../../sdk";
import { Pageable, UserOrderDto, StoreOrderDto } from "../../../shared/types/dtos.ts";

const order = "orders";
const store = "stores";

export async function getUserOrders(this: SDK, pageable: Pageable): Promise<UserOrderDto[]> {
    const response = await this.get(`${order}`, pageable, {
        action: 'getUserOrders',
        resource: 'orders'
    });

    const result = (await response.json()) as UserOrderDto[];
    return result;
}

export async function getUserOrderById(this: SDK, id: string): Promise<UserOrderDto> {
    const response = await this.get(`${order}/${id}`, {}, {
        action: 'getUserOrderById',
        resource: 'order',
        resourceId: id
    });

    const result = (await response.json()) as UserOrderDto;
    return result;
}

export async function getStoreOrderById(this: SDK, orderId: string, storeId: string): Promise<StoreOrderDto> {
    const response = await this.get(`${order}/${orderId}/${store}/${storeId}`, {}, {
        action: 'getStoreOrderById',
        resource: 'order',
        resourceId: orderId,
        additionalInfo: { storeId }
    });

    const result = (await response.json()) as StoreOrderDto;
    return result;
}

export async function getStoreOrders(this: SDK, storeId: string, pageable: Pageable): Promise<StoreOrderDto[]> {
    const response = await this.get(`${order}/${store}/${storeId}`, pageable, {
        action: 'getStoreOrders',
        resource: 'orders',
        additionalInfo: { storeId }
    });

    const result = (await response.json()) as StoreOrderDto[];
    return result;
}